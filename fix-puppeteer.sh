#!/bin/bash

# Script para corrigir problema do Puppeteer
# Execute como root

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute este script como root (sudo)"
    exit 1
fi

# Solicitar nome da instância
read -p "Nome da instância (ex: flowchatbr): " INSTANCE_NAME

if [ -z "$INSTANCE_NAME" ]; then
    print_error "Nome da instância é obrigatório!"
    exit 1
fi

print_status "Corrigindo permissões e Puppeteer..."

# 1. Criar diretórios necessários
print_status "Criando diretórios de cache..."
mkdir -p /home/deploy/.npm
mkdir -p /home/deploy/.cache
mkdir -p /home/deploy/.config

# 2. Corrigir permissões
print_status "Corrigindo permissões..."
chown -R deploy:deploy /home/deploy/.npm
chown -R deploy:deploy /home/deploy/.cache
chown -R deploy:deploy /home/deploy/.config

# 3. Limpar instalação anterior
print_status "Limpando instalação anterior..."
rm -rf /home/deploy/$INSTANCE_NAME/backend/node_modules
rm -rf /home/deploy/$INSTANCE_NAME/backend/package-lock.json

# 4. Instalar backend sem Puppeteer
print_status "Instalando dependências do backend..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm cache clean --force"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && PUPPETEER_SKIP_DOWNLOAD=true npm install"

# 5. Build do backend
print_status "Fazendo build do backend..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm run build"

# 6. Executar migrações
print_status "Executando migrações do banco..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:migrate"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:seed:all"

# 7. Instalar frontend
print_status "Instalando dependências do frontend..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm cache clean --force"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm install"

# 8. Build do frontend
print_status "Fazendo build do frontend..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm run build"

print_status "Instalação das dependências concluída!"
print_status "Agora você pode continuar com a configuração do Nginx e PM2."
print_warning "Execute: ./install-flowchatbr-simple.sh" 