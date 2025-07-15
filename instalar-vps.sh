#!/bin/bash

echo "========================================"
echo "    FLOWCHAT BR - INSTALADOR VPS"
echo "========================================"
echo

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
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

# Solicitar informações do domínio
echo "========================================"
echo "    CONFIGURAÇÃO DE DOMÍNIO"
echo "========================================"
echo

read -p "Digite seu domínio principal (ex: flowchatbr.com): " DOMAIN
read -p "Digite o diretório de instalação (ex: /home/deploy/FlowChatBR): " INSTALL_DIR

# Validar entrada
if [ -z "$DOMAIN" ]; then
    print_error "Domínio não pode estar vazio"
    exit 1
fi

if [ -z "$INSTALL_DIR" ]; then
    INSTALL_DIR="/home/deploy/FlowChatBR"
fi

print_status "Iniciando instalação do FlowChatBR..."
print_info "Domínio: $DOMAIN"
print_info "Diretório: $INSTALL_DIR"

# Atualizar sistema
print_status "Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências
print_status "Instalando dependências..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release nginx certbot python3-certbot-nginx

# Instalar Node.js 18
print_status "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar Docker
print_status "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Instalar Docker Compose
print_status "Instalando Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Criar diretório do projeto
print_status "Criando diretório do projeto..."
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clonar repositório
print_status "Baixando código do GitHub..."
git clone https://github.com/bastos2026/flowchat-br.git .
if [ $? -ne 0 ]; then
    print_error "Erro ao baixar o código do GitHub"
    exit 1
fi

# Configurar permissões
print_status "Configurando permissões..."
chmod +x instalador-main/install.sh

# Configurar Nginx
print_status "Configurando Nginx..."

# Criar configuração do Nginx para subdomínios
cat > /etc/nginx/sites-available/flowchat-br << EOF
# Configuração para app.flowchatbr.com (Frontend)
server {
    listen 80;
    server_name app.$DOMAIN;
    
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
}

# Configuração para api.flowchatbr.com (Backend)
server {
    listen 80;
    server_name api.$DOMAIN;
    
    location / {
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

# Configuração para o domínio principal (redirecionamento)
server {
    listen 80;
    server_name $DOMAIN;
    
    return 301 http://app.$DOMAIN;
}
EOF

# Ativar configuração
ln -sf /etc/nginx/sites-available/flowchat-br /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t
if [ $? -ne 0 ]; then
    print_error "Erro na configuração do Nginx"
    exit 1
fi

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

# Configurar SSL com Let's Encrypt
print_status "Configurando SSL com Let's Encrypt..."

# Verificar se os domínios estão apontando para o servidor
print_warning "Certifique-se de que os seguintes domínios estão apontando para este servidor:"
print_info "  - app.$DOMAIN"
print_info "  - api.$DOMAIN"
print_info "  - $DOMAIN"
echo

read -p "Os domínios estão configurados? (s/n): " DOMAINS_READY

if [ "$DOMAINS_READY" = "s" ] || [ "$DOMAINS_READY" = "S" ]; then
    print_status "Obtendo certificados SSL..."
    
    # Obter certificado para app subdomain
    certbot --nginx -d app.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Obter certificado para api subdomain
    certbot --nginx -d api.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Obter certificado para domínio principal
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Configurar renovação automática
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    print_status "SSL configurado com sucesso!"
else
    print_warning "SSL não configurado. Configure os domínios e execute:"
    print_info "  certbot --nginx -d app.$DOMAIN -d api.$DOMAIN -d $DOMAIN"
fi

# Executar instalador automático
print_status "Executando instalador automático..."
cd instalador-main
./install.sh

if [ $? -eq 0 ]; then
    echo
    echo "========================================"
    echo "    INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    echo "========================================"
    echo
    print_status "O sistema FlowChatBR foi instalado com sucesso!"
    echo
    print_info "🌐 URLs de acesso:"
    print_info "  Frontend (Painel): https://app.$DOMAIN"
    print_info "  Backend (API): https://api.$DOMAIN"
    print_info "  Domínio Principal: https://$DOMAIN"
    echo
    print_info "📁 Diretório: $INSTALL_DIR"
    echo
    print_info "🔧 Comandos úteis:"
    print_info "  Verificar status: docker-compose ps"
    print_info "  Ver logs: docker-compose logs -f"
    print_info "  Reiniciar: docker-compose restart"
    print_info "  Parar: docker-compose down"
    print_info "  Iniciar: docker-compose up -d"
    echo
    print_warning "⚠️  IMPORTANTE:"
    print_warning "  - Configure os domínios no seu provedor DNS"
    print_warning "  - Aguarde a propagação DNS (pode levar até 24h)"
    print_warning "  - Se SSL não foi configurado, execute manualmente"
    echo
else
    print_error "Erro durante a instalação"
    exit 1
fi 