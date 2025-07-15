#!/bin/bash

# FlowChatBR - Instalador Simplificado
# Sistema sem filas com subdomínios

set -e  # Para o script se houver erro

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

# Banner
echo "========================================"
echo "    FLOWCHAT BR - INSTALADOR SIMPLES"
echo "========================================"
echo

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute este script como root (sudo)"
    exit 1
fi

# Solicitar informações
echo "Configuração do Sistema:"
echo
read -p "Nome da instância (ex: flowchatbr): " INSTANCE_NAME
read -p "Domínio principal (ex: flowchatbr.com): " DOMAIN
read -p "Senha para deploy e banco: " MYSQL_PASSWORD

# Validar entradas
if [ -z "$INSTANCE_NAME" ] || [ -z "$DOMAIN" ] || [ -z "$MYSQL_PASSWORD" ]; then
    print_error "Todos os campos são obrigatórios!"
    exit 1
fi

# Configurar variáveis
FRONTEND_URL="https://app.$DOMAIN"
BACKEND_URL="https://api.$DOMAIN"
FRONTEND_PORT="3000"
BACKEND_PORT="4000"
REDIS_PORT="6379"
MAX_WHATS="10"
MAX_USERS="5"

print_status "Iniciando instalação do FlowChatBR..."

# 1. Criar usuário deploy
print_status "Criando usuário deploy..."
useradd -m -s /bin/bash -G sudo deploy 2>/dev/null || true
echo "deploy:$MYSQL_PASSWORD" | chpasswd

# 2. Instalar dependências
print_status "Instalando dependências..."
apt update
apt install -y curl wget git unzip software-properties-common nginx certbot python3-certbot-nginx postgresql postgresql-contrib

# 3. Instalar Node.js
print_status "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Instalar Docker
print_status "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 5. Instalar PM2
print_status "Instalando PM2..."
npm install -g pm2

# 6. Criar diretório da instância
print_status "Criando estrutura de diretórios..."
mkdir -p /home/deploy/$INSTANCE_NAME
chown -R deploy:deploy /home/deploy/$INSTANCE_NAME

# 7. Copiar código modificado
print_status "Copiando código FlowChatBR..."
cp -r /root/flowchat-br/codatendechat-main/* /home/deploy/$INSTANCE_NAME/
chown -R deploy:deploy /home/deploy/$INSTANCE_NAME

# 8. Configurar banco PostgreSQL
print_status "Configurando banco de dados..."
sudo -u postgres psql -c "CREATE USER $INSTANCE_NAME WITH PASSWORD '$MYSQL_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $INSTANCE_NAME OWNER $INSTANCE_NAME;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $INSTANCE_NAME TO $INSTANCE_NAME;"

# 9. Configurar Redis
print_status "Configurando Redis..."
docker run --name redis-$INSTANCE_NAME -p $REDIS_PORT:6379 --restart always -d redis redis-server --requirepass $MYSQL_PASSWORD

# 10. Configurar backend
print_status "Configurando backend..."
cat > /home/deploy/$INSTANCE_NAME/backend/.env << EOF
NODE_ENV=production
BACKEND_URL=$BACKEND_URL
FRONTEND_URL=$FRONTEND_URL
PROXY_PORT=443
PORT=$BACKEND_PORT

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=$INSTANCE_NAME
DB_PASS=$MYSQL_PASSWORD
DB_NAME=$INSTANCE_NAME

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

REDIS_URI=redis://:$MYSQL_PASSWORD@127.0.0.1:$REDIS_PORT
REDIS_OPT_LIMITER_MAX=1
REGIS_OPT_LIMITER_DURATION=3000

USER_LIMIT=$MAX_USERS
CONNECTIONS_LIMIT=$MAX_WHATS
CLOSED_SEND_BY_ME=true
EOF

# 11. Configurar frontend
print_status "Configurando frontend..."
cat > /home/deploy/$INSTANCE_NAME/frontend/.env << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
REACT_APP_REACT_APP_URL_API=$BACKEND_URL
EOF

# 12. Instalar dependências e build
print_status "Instalando dependências e fazendo build..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm install"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm run build"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:migrate"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:seed:all"

sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm install"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm run build"

# 13. Configurar Nginx
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/$INSTANCE_NAME << EOF
# Frontend
server {
    listen 80;
    server_name app.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
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

# Backend
server {
    listen 80;
    server_name api.$DOMAIN;
    
    location / {
        proxy_pass http://localhost:$BACKEND_PORT;
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

# Principal
server {
    listen 80;
    server_name $DOMAIN;
    return 301 http://app.$DOMAIN;
}
EOF

ln -sf /etc/nginx/sites-available/$INSTANCE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 14. Iniciar aplicações com PM2
print_status "Iniciando aplicações..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && pm2 start dist/server.js --name $INSTANCE_NAME-backend"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && pm2 start npm --name $INSTANCE_NAME-frontend -- start"
sudo -u deploy bash -c "pm2 save"
sudo -u deploy bash -c "pm2 startup"

# 15. Configurar SSL (se domínios estiverem prontos)
print_warning "Configure os domínios DNS antes de continuar:"
print_info "  app.$DOMAIN -> $(curl -s ifconfig.me)"
print_info "  api.$DOMAIN -> $(curl -s ifconfig.me)"
print_info "  $DOMAIN -> $(curl -s ifconfig.me)"
echo

read -p "Os domínios estão configurados? (s/n): " DOMAINS_READY

if [ "$DOMAINS_READY" = "s" ] || [ "$DOMAINS_READY" = "S" ]; then
    print_status "Configurando SSL..."
    certbot --nginx -d app.$DOMAIN -d api.$DOMAIN -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    print_status "SSL configurado!"
else
    print_warning "SSL não configurado. Execute manualmente:"
    print_info "certbot --nginx -d app.$DOMAIN -d api.$DOMAIN -d $DOMAIN"
fi

# 16. Finalizar
echo
echo "========================================"
echo "    INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "========================================"
echo
print_status "Sistema FlowChatBR instalado!"
echo
print_info "🌐 URLs de acesso:"
print_info "  Frontend: https://app.$DOMAIN"
print_info "  Backend: https://api.$DOMAIN"
print_info "  Principal: https://$DOMAIN"
echo
print_info "📁 Diretório: /home/deploy/$INSTANCE_NAME"
echo
print_info "🔧 Comandos úteis:"
print_info "  Status: pm2 status"
print_info "  Logs: pm2 logs"
print_info "  Reiniciar: pm2 restart all"
print_info "  Parar: pm2 stop all"
print_info "  Iniciar: pm2 start all"
echo
print_info "👤 Usuário padrão:"
print_info "  Email: admin@admin.com"
print_info "  Senha: 123456"
echo 