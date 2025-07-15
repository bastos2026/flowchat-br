@echo off
echo 🚀 FLOWCHAT BR - SETUP GITHUB
echo ================================
echo.

echo 📋 Verificando se o Git está instalado...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado. Por favor, instale o Git primeiro:
    echo https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git encontrado!

echo.
echo 🔧 Configurando Git...
echo Por favor, insira suas informações:
echo.

set /p GIT_NAME="Nome completo: "
set /p GIT_EMAIL="Email: "
set /p GITHUB_USER="Usuário do GitHub: "

git config --global user.name "%GIT_NAME%"
git config --global user.email "%GIT_EMAIL%"

echo.
echo 📁 Inicializando repositório Git...
git init

echo.
echo 📦 Adicionando arquivos...
git add .

echo.
echo 💾 Fazendo primeiro commit...
git commit -m "🚀 FlowChatBR - Sistema de Atendimento WhatsApp Modernizado

✅ Design ultra moderno com glassmorphism
✅ Cores brasileiras (verde, azul, verde WhatsApp)
✅ Sistema de leads expandido (50+ campos)
✅ Chat modernizado com bubbles estilizadas
✅ Dashboard renovado com métricas animadas
✅ Header e sidebar responsivos
✅ Instalador automático para Ubuntu 22.04
✅ Backend preservado com todas as funcionalidades
✅ Documentação completa

🇧🇷 Pronto para revolucionar o atendimento WhatsApp brasileiro!"

echo.
echo 🔗 Configurando repositório remoto...
git remote add origin https://github.com/%GITHUB_USER%/flowchat-br.git

echo.
echo 📤 Enviando para GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ PROJETO ENVIADO COM SUCESSO!
echo.
echo 🌐 Acesse: https://github.com/%GITHUB_USER%/flowchat-br
echo.
echo 📋 PRÓXIMOS PASSOS:
echo 1. Conecte na sua VPS via SSH
echo 2. Execute: git clone https://github.com/%GITHUB_USER%/flowchat-br.git
echo 3. Execute: cd flowchat-br/instalador-main && ./install_primaria
echo.
echo 📖 Consulte o arquivo GUIA_GITHUB_VPS.md para instruções detalhadas
echo.
pause 