#!/bin/bash

# Script para continuar instalação do FlowChat
# Execute como root

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute este script como root (sudo)"
    exit 1
fi

# Solicitar informações
read -p "Nome da instância (ex: flowchatbr): " INSTANCE_NAME
read -p "Domínio (ex: flowchatbr.com): " DOMAIN
read -p "Senha do banco: " MYSQL_PASSWORD

if [ -z "$INSTANCE_NAME" ] || [ -z "$DOMAIN" ] || [ -z "$MYSQL_PASSWORD" ]; then
    print_error "Todos os campos são obrigatórios!"
    exit 1
fi

print_status "Continuando instalação do FlowChat..."

# 1. Remover diretório existente e baixar código
print_status "Baixando código original..."
cd /home/deploy
sudo -u deploy rm -rf $INSTANCE_NAME
sudo -u deploy git clone https://github.com/codatendechat/flowchat.git $INSTANCE_NAME
cd $INSTANCE_NAME

# 2. Aplicar cores brasileiras básicas
print_status "Aplicando cores brasileiras..."
cd frontend

# Criar arquivo de cores brasileiras
mkdir -p src/styles
cat > src/styles/brazilianColors.css << 'EOF'
/* Cores da Bandeira Brasileira */
:root {
  --brazil-green: #009c3b;
  --brazil-yellow: #ffdf00;
  --brazil-blue: #002776;
  --brazil-white: #ffffff;
}

/* Aplicar cores nos elementos principais */
.MuiAppBar-root {
  background: linear-gradient(135deg, var(--brazil-green) 0%, #00d152 100%) !important;
  border-bottom: 3px solid var(--brazil-yellow) !important;
}

.MuiButton-contained {
  background-color: var(--brazil-green) !important;
  color: white !important;
}

.MuiButton-contained:hover {
  background-color: #00d152 !important;
}

.MuiFab-primary {
  background-color: var(--brazil-green) !important;
}

.MuiFab-primary:hover {
  background-color: #00d152 !important;
}

/* Header brasileiro */
.app-header {
  background: linear-gradient(135deg, var(--brazil-green) 0%, #00d152 100%);
  border-bottom: 3px solid var(--brazil-yellow);
  color: white;
}

/* Botões brasileiros */
.btn-brazil {
  background: linear-gradient(45deg, var(--brazil-green) 30%, #00d152 90%);
  border: 0;
  border-radius: 8px;
  color: white;
  padding: 10px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(0, 156, 59, 0.3);
}

.btn-brazil:hover {
  background: linear-gradient(45deg, #00d152 30%, #00ff6b 90%);
  box-shadow: 0 6px 16px rgba(0, 156, 59, 0.4);
}

/* Cards brasileiros */
.card-brazil {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 156, 59, 0.1);
}

/* Logo brasileiro */
.logo-brazil {
  background: linear-gradient(45deg, var(--brazil-white) 30%, var(--brazil-yellow) 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}
EOF

# Adicionar import no App.js
if [ -f "src/App.js" ]; then
    # Verificar se já tem o import
    if ! grep -q "brazilianColors.css" src/App.js; then
        # Adicionar import no início do arquivo
        sed -i '1i import "./styles/brazilianColors.css";' src/App.js
    fi
fi

cd ..

# 3. Configurar backend
print_status "Configurando backend..."
cat > backend/.env << EOF
NODE_ENV=production
BACKEND_URL=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
PROXY_PORT=443
PORT=4000

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=$INSTANCE_NAME
DB_PASS=$MYSQL_PASSWORD
DB_NAME=$INSTANCE_NAME

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

REDIS_URI=redis://:$MYSQL_PASSWORD@127.0.0.1:6379
REDIS_OPT_LIMITER_MAX=1
REGIS_OPT_LIMITER_DURATION=3000

USER_LIMIT=5
CONNECTIONS_LIMIT=10
CLOSED_SEND_BY_ME=true
EOF

# 4. Configurar frontend
print_status "Configurando frontend..."
cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
REACT_APP_REACT_APP_URL_API=https://$DOMAIN
EOF

# 5. Instalar dependências
print_status "Instalando dependências..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm install"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm install"

# 6. Build e migrações
print_status "Fazendo build e migrações..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm run build"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:migrate"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:seed:all"

sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm run build"

# 7. Configurar Nginx
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/$INSTANCE_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$INSTANCE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 8. Iniciar aplicações
print_status "Iniciando aplicações..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && pm2 start dist/server.js --name $INSTANCE_NAME-backend"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && pm2 start npm --name $INSTANCE_NAME-frontend -- start"
sudo -u deploy bash -c "pm2 save"
sudo -u deploy bash -c "pm2 startup"

# 9. Configurar SSL
print_warning "Configure o domínio DNS antes de continuar:"
print_info "  $DOMAIN -> $(curl -s ifconfig.me)"
echo

read -p "O domínio está configurado? (s/n): " DOMAIN_READY

if [ "$DOMAIN_READY" = "s" ] || [ "$DOMAIN_READY" = "S" ]; then
    print_status "Configurando SSL..."
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    print_status "SSL configurado!"
else
    print_warning "SSL não configurado. Execute manualmente:"
    print_info "certbot --nginx -d $DOMAIN"
fi

# 10. Finalizar
echo
echo "========================================"
echo "    INSTALAÇÃO CONCLUÍDA!"
echo "========================================"
echo
print_status "Sistema FlowChat instalado!"
print_info "✅ Backend original (estável)"
print_info "✅ Cores brasileiras aplicadas"
echo
print_info "🌐 URL de acesso: https://$DOMAIN"
echo
print_info "📁 Diretório: /home/deploy/$INSTANCE_NAME"
echo
print_info "🔧 Comandos úteis:"
print_info "  Status: pm2 status"
print_info "  Logs: pm2 logs"
print_info "  Reiniciar: pm2 restart all"
echo
print_info "👤 Usuário padrão:"
print_info "  Email: admin@admin.com"
print_info "  Senha: 123456"
echo
print_info "🎨 Cores aplicadas:"
print_info "  ✅ Verde da bandeira (#009c3b)"
print_info "  ✅ Amarelo da bandeira (#ffdf00)"
print_info "  ✅ Gradientes brasileiros"
print_info "  ✅ CSS customizado" 