#!/bin/bash

# Script para limpar arquivos desnecessários do projeto
# Execute no Windows antes de enviar para GitHub

echo "🧹 Limpando arquivos desnecessários..."

# Remover arquivos de instalação antigos
rm -f install-flowchatbr-simple.sh
rm -f fix-database.sh
rm -f fix-puppeteer.sh
rm -f continue-install.sh
rm -f install-original.sh

# Remover arquivos temporários
rm -f *.tmp
rm -f *.log
rm -f *.bak

# Remover diretórios de build (serão recriados)
rm -rf codatendechat-main/backend/dist
rm -rf codatendechat-main/backend/node_modules
rm -rf codatendechat-main/frontend/build
rm -rf codatendechat-main/frontend/node_modules

# Remover arquivos de lock (serão recriados)
rm -f codatendechat-main/backend/package-lock.json
rm -f codatendechat-main/frontend/package-lock.json

# Remover arquivos de configuração local
rm -f codatendechat-main/backend/.env
rm -f codatendechat-main/frontend/.env

# Remover arquivos de cache
rm -rf .git/objects/pack/*.pack
rm -rf .git/objects/pack/*.idx

echo "✅ Limpeza concluída!"
echo "📁 Arquivos mantidos:"
echo "  - install-hybrid.sh (instalador principal)"
echo "  - GUIA_INSTALACAO_COMPLETO.md (documentação)"
echo "  - README.md (informações do projeto)"
echo "  - codatendechat-main/ (código fonte)"
echo ""
echo "🚀 Agora você pode enviar para o GitHub!" 