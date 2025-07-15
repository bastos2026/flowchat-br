@echo off
echo ========================================
echo    FLOWCHAT BR - ENVIANDO PARA GITHUB
echo ========================================
echo.

echo [1/6] Verificando se Git esta instalado...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Git nao esta instalado!
    echo Instale o Git em: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git encontrado!

echo.
echo [2/6] Configurando Git...
git config --global user.name "bastos2026"
git config --global user.email "bastos2026@github.com"

echo.
echo [3/6] Verificando repositório...
if exist .git (
    echo Repositório Git encontrado!
    echo Removendo configuração anterior...
    git remote remove origin 2>nul
) else (
    echo Inicializando novo repositório...
    git init
)

echo.
echo [4/6] Adicionando arquivos...
git add .

echo.
echo [5/6] Fazendo commit...
git commit -m "FlowChatBR - Sistema sem filas com subdominios e SSL"

echo.
echo [6/6] Configurando e enviando para GitHub...
git remote add origin https://github.com/bastos2026/flowchat-br.git
git branch -M main
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo ERRO: Falha ao enviar para GitHub!
    echo Verifique se:
    echo - O repositório existe no GitHub
    echo - Você tem permissão para enviar
    echo - Sua conexão com internet está funcionando
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SUCESSO! Sistema enviado para GitHub
echo ========================================
echo.
echo Repositorio: https://github.com/bastos2026/flowchat-br
echo.
echo Arquivos enviados:
echo - Sistema sem filas (backend modificado)
echo - Instalador com subdominios (instalar-vps.sh)
echo - Guia DNS (configurar-dominios.md)
echo - README atualizado
echo.
pause 