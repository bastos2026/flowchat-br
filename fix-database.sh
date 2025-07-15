#!/bin/bash

# Script para corrigir problema do banco PostgreSQL
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
read -p "Senha do banco: " MYSQL_PASSWORD

if [ -z "$INSTANCE_NAME" ] || [ -z "$MYSQL_PASSWORD" ]; then
    print_error "Todos os campos são obrigatórios!"
    exit 1
fi

print_status "Corrigindo banco de dados PostgreSQL..."

# 1. Forçar desconexão de todas as sessões
print_status "Desconectando sessões ativas..."
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$INSTANCE_NAME' AND pid <> pg_backend_pid();" 2>/dev/null || true

# 2. Remover banco de dados
print_status "Removendo banco de dados..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $INSTANCE_NAME;" 2>/dev/null || true

# 3. Remover usuário
print_status "Removendo usuário..."
sudo -u postgres psql -c "DROP USER IF EXISTS $INSTANCE_NAME;" 2>/dev/null || true

# 4. Criar usuário e banco novamente
print_status "Criando usuário e banco..."
sudo -u postgres psql -c "CREATE USER $INSTANCE_NAME WITH PASSWORD '$MYSQL_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $INSTANCE_NAME OWNER $INSTANCE_NAME;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $INSTANCE_NAME TO $INSTANCE_NAME;"

print_status "Banco de dados corrigido com sucesso!"
print_status "Agora você pode continuar a instalação executando:"
print_warning "./install-flowchatbr-simple.sh" 