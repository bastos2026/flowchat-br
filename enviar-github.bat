@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    ENVIANDO FLOWCHAT BR PARA GITHUB
echo ========================================
echo.

:: Verificar se Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Git não está instalado!
    echo Baixe em: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: Limpar arquivos desnecessários
echo [INFO] Limpando arquivos desnecessários...
if exist "install-flowchatbr-simple.sh" del "install-flowchatbr-simple.sh"
if exist "fix-database.sh" del "fix-database.sh"
if exist "fix-puppeteer.sh" del "fix-puppeteer.sh"
if exist "continue-install.sh" del "continue-install.sh"
if exist "install-original.sh" del "install-original.sh"

:: Remover diretórios de build
if exist "codatendechat-main\backend\node_modules" rmdir /s /q "codatendechat-main\backend\node_modules"
if exist "codatendechat-main\backend\dist" rmdir /s /q "codatendechat-main\backend\dist"
if exist "codatendechat-main\frontend\node_modules" rmdir /s /q "codatendechat-main\frontend\node_modules"
if exist "codatendechat-main\frontend\build" rmdir /s /q "codatendechat-main\frontend\build"

:: Remover arquivos de lock
if exist "codatendechat-main\backend\package-lock.json" del "codatendechat-main\backend\package-lock.json"
if exist "codatendechat-main\frontend\package-lock.json" del "codatendechat-main\frontend\package-lock.json"

:: Remover arquivos .env
if exist "codatendechat-main\backend\.env" del "codatendechat-main\backend\.env"
if exist "codatendechat-main\frontend\.env" del "codatendechat-main\frontend\.env"

echo [INFO] Limpeza concluída!
echo.

:: Solicitar informações
set /p GITHUB_USER="Digite seu usuário GitHub (ex: bastos2026): "
set /p GITHUB_EMAIL="Digite seu email GitHub: "
set /p GITHUB_NAME="Digite seu nome completo: "

:: Configurar Git
echo [INFO] Configurando Git...
git config --global user.name "%GITHUB_NAME%"
git config --global user.email "%GITHUB_EMAIL%"

:: Inicializar repositório
echo [INFO] Inicializando repositório Git...
if exist ".git" (
    echo [INFO] Repositório Git já existe!
) else (
    git init
)

:: Adicionar todos os arquivos
echo [INFO] Adicionando arquivos...
git add .

:: Fazer commit
echo [INFO] Fazendo commit...
git commit -m "🚀 FlowChat BR - Sistema de Atendimento WhatsApp Moderno

✅ Backend estável (MySQL + Redis)
✅ Frontend moderno (cores brasileiras)
✅ Sistema de filas funcionando
✅ Design responsivo para mobile
✅ SSL automático (Let's Encrypt)
✅ Instalação simplificada (1 comando)

🇧🇷 Desenvolvido com ❤️ para o Brasil"

:: Configurar branch main
echo [INFO] Configurando branch main...
git branch -M main

:: Adicionar remote
echo [INFO] Configurando repositório remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/flowchat-br.git

:: Enviar para GitHub
echo [INFO] Enviando para GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao enviar para GitHub!
    echo.
    echo Possíveis soluções:
    echo 1. Verifique se o repositório existe: https://github.com/%GITHUB_USER%/flowchat-br
    echo 2. Verifique se o repositório é público
    echo 3. Verifique suas credenciais do GitHub
    echo.
    echo Para criar o repositório:
    echo 1. Acesse: https://github.com/new
    echo 2. Nome: flowchat-br
    echo 3. Descrição: Sistema de Atendimento WhatsApp Moderno
    echo 4. Marcar como Público
    echo 5. Criar repositório
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ENVIADO COM SUCESSO! 🎉
echo ========================================
echo.
echo [SUCESSO] Código enviado para GitHub!
echo [URL] https://github.com/%GITHUB_USER%/flowchat-br
echo.
echo [INFO] Agora você pode instalar na VPS:
echo.
echo 1. Conectar na VPS:
echo    ssh root@IP_DA_VPS
echo.
echo 2. Baixar e executar:
echo    wget https://raw.githubusercontent.com/%GITHUB_USER%/flowchat-br/main/install-hybrid.sh
echo    chmod +x install-hybrid.sh
echo    ./install-hybrid.sh
echo.
echo 3. Ou usar o instalador alternativo:
echo    wget https://raw.githubusercontent.com/%GITHUB_USER%/flowchat-br/main/install-hybrid-alt.sh
echo    chmod +x install-hybrid-alt.sh
echo    ./install-hybrid-alt.sh
echo.
pause 