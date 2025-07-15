#!/bin/bash

# 🚀 FLOWCHAT BR - INSTALADOR VPS
# ================================

echo "🚀 FLOWCHAT BR - INSTALADOR VPS"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se é root
if [[ $EUID -eq 0 ]]; then
   print_error "Este script não deve ser executado como root!"
   print_info "Execute como usuário normal com sudo quando necessário."
   exit 1
fi

# Verificar sistema operacional
if [[ ! -f /etc/os-release ]]; then
    print_error "Sistema operacional não suportado!"
    exit 1
fi

source /etc/os-release
if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
    print_warning "Sistema operacional não testado: $ID"
    print_info "Recomendado: Ubuntu 22.04 LTS"
fi

print_status "Sistema operacional detectado: $ID $VERSION_ID"

# Solicitar informações do usuário
echo ""
print_info "Configuração do FlowChatBR"
echo "================================"

read -p "🌐 Digite o domínio (ou IP da VPS): " DOMAIN
read -p "👤 Digite o usuário do GitHub: " GITHUB_USER
read -p "📧 Email do administrador: " ADMIN_EMAIL
read -s -p "🔒 Senha do administrador: " ADMIN_PASSWORD
echo ""

# Confirmar instalação
echo ""
print_warning "CONFIRMAÇÃO DE INSTALAÇÃO"
echo "================================"
echo "Domínio: $DOMAIN"
echo "GitHub User: $GITHUB_USER"
echo "Email Admin: $ADMIN_EMAIL"
echo ""

read -p "🤔 Confirmar instalação? (y/N): " -n 1 -r
echo ""
if [[ ! $REply =~ ^[Yy]$ ]]; then
    print_info "Instalação cancelada!"
    exit 0
fi

echo ""
print_status "Iniciando instalação do FlowChatBR..."

# 1. Atualizar sistema
print_status "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências básicas
print_status "Instalando dependências básicas..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release htop

# 3. Verificar Git
if ! command -v git &> /dev/null; then
    print_error "Git não foi instalado corretamente!"
    exit 1
fi
print_status "Git instalado: $(git --version)"

# 4. Criar diretório do projeto
print_status "Criando diretório do projeto..."
mkdir -p /opt/flowchat-br
cd /opt/flowchat-br

# 5. Clonar projeto do GitHub
print_status "Baixando projeto do GitHub..."
if git clone https://github.com/$GITHUB_USER/flowchat-br.git .; then
    print_status "Projeto baixado com sucesso!"
else
    print_error "Erro ao baixar projeto do GitHub!"
    print_info "Verifique se o repositório existe: https://github.com/$GITHUB_USER/flowchat-br"
    exit 1
fi

# 6. Configurar permissões
print_status "Configurando permissões..."
sudo chown -R $USER:$USER /opt/flowchat-br
chmod +x instalador-main/install_primaria

# 7. Verificar se o instalador existe
if [[ ! -f "instalador-main/install_primaria" ]]; then
    print_error "Instalador não encontrado!"
    print_info "Verifique se o projeto foi baixado corretamente."
    exit 1
fi

# 8. Executar instalador
print_status "Executando instalador automático..."
cd instalador-main

# Criar arquivo de configuração automática
cat > auto_config.txt << EOF
$DOMAIN
$ADMIN_EMAIL
$ADMIN_PASSWORD
y
y
EOF

# Executar instalador com configuração automática
if ./install_primaria < auto_config.txt; then
    print_status "Instalação concluída com sucesso!"
else
    print_error "Erro durante a instalação!"
    print_info "Verifique os logs para mais detalhes."
    exit 1
fi

# 9. Configurar backup automático
print_status "Configurando backup automático..."
cat > /opt/flowchat-br/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/flowchat-br"

mkdir -p $BACKUP_DIR

# Backup do banco
pg_dump flowchat_br > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /opt/flowchat-br

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup realizado: $DATE"
EOF

chmod +x /opt/flowchat-br/backup.sh

# Agendar backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/flowchat-br/backup.sh") | crontab -

# 10. Verificar status dos serviços
print_status "Verificando status dos serviços..."
sleep 5

if pm2 status | grep -q "online"; then
    print_status "Serviços iniciados com sucesso!"
else
    print_warning "Alguns serviços podem não estar rodando."
    print_info "Execute 'pm2 status' para verificar."
fi

# 11. Informações finais
echo ""
print_status "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo ""
print_info "🌐 URL de acesso:"
echo "   http://$DOMAIN"
echo "   https://$DOMAIN (se SSL foi configurado)"
echo ""
print_info "👤 Credenciais de acesso:"
echo "   Email: $ADMIN_EMAIL"
echo "   Senha: [definida durante instalação]"
echo ""
print_info "📊 Comandos úteis:"
echo "   pm2 status          - Status dos serviços"
echo "   pm2 logs            - Ver logs"
echo "   htop                - Monitor de recursos"
echo "   /opt/flowchat-br/backup.sh - Backup manual"
echo ""
print_info "📱 O sistema é totalmente responsivo e funciona em mobile!"
echo ""
print_info "🇧🇷 FlowChatBR está pronto para revolucionar seu atendimento WhatsApp!"
echo ""

# Verificar se o sistema está acessível
print_status "Testando acesso ao sistema..."
if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|302"; then
    print_status "Sistema acessível via HTTP!"
else
    print_warning "Sistema pode não estar acessível ainda."
    print_info "Aguarde alguns minutos e tente novamente."
fi

echo ""
print_info "📖 Para mais informações, consulte:"
echo "   - GUIA_INSTALACAO_FLOWCHAT_BR.md"
echo "   - FLOWCHAT_BR_IMPLEMENTATION.md"
echo ""
print_info "🚀 FlowChatBR instalado com sucesso na sua VPS!" 