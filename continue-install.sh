#!/bin/bash

# Script para continuar instalação do FlowChatBR
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
read -p "Domínio principal (ex: flowchatbr.com): " DOMAIN
read -p "Senha do banco: " MYSQL_PASSWORD

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

print_status "Continuando instalação do FlowChatBR..."

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