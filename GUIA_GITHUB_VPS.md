# 🚀 GUIA COMPLETO: GITHUB + INSTALAÇÃO VPS

## 📋 **PASSO 1: PREPARAR O PROJETO PARA GITHUB**

### **1.1 Inicializar Git e Configurar**

```bash
# 1. Navegar para a pasta do projeto
cd "C:\Users\João\Desktop\Sistemas ONplay\flochat-modificado"

# 2. Inicializar repositório Git
git init

# 3. Configurar usuário Git (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"

# 4. Adicionar todos os arquivos
git add .

# 5. Fazer primeiro commit
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
```

### **1.2 Criar Repositório no GitHub**

1. **Acesse**: https://github.com
2. **Faça login** na sua conta
3. **Clique** em "New repository" (botão verde)
4. **Configure o repositório**:
   - **Repository name**: `flowchat-br`
   - **Description**: `Sistema de Atendimento WhatsApp Ultra Moderno - FlowChatBR`
   - **Visibility**: Public (ou Private se preferir)
   - **NÃO marque** "Add a README file" (já temos)
   - **NÃO marque** "Add .gitignore" (já temos)
5. **Clique** em "Create repository"

### **1.3 Conectar e Enviar para GitHub**

```bash
# 1. Adicionar repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/flowchat-br.git

# 2. Enviar para GitHub
git branch -M main
git push -u origin main

# 3. Verificar se foi enviado
git status
```

## 🖥️ **PASSO 2: INSTALAR NA VPS**

### **2.1 Conectar na VPS**

```bash
# Conectar via SSH (substitua pelos seus dados)
ssh root@IP_DA_SUA_VPS
# ou
ssh usuario@IP_DA_SUA_VPS
```

### **2.2 Preparar o Servidor**

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências básicas
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release htop

# 3. Verificar se tudo foi instalado
git --version
curl --version
```

### **2.3 Download do Projeto**

```bash
# 1. Criar diretório do projeto
mkdir -p /opt/flowchat-br
cd /opt/flowchat-br

# 2. Clonar do GitHub (substitua SEU_USUARIO)
git clone https://github.com/SEU_USUARIO/flowchat-br.git .

# 3. Verificar se foi baixado
ls -la

# 4. Dar permissões
sudo chown -R $USER:$USER /opt/flowchat-br
chmod +x instalador-main/install_primaria
```

### **2.4 Executar Instalador Automático**

```bash
# 1. Navegar para pasta do instalador
cd instalador-main

# 2. Executar instalação
./install_primaria

# 3. Seguir as instruções interativas:
#    - Digite o domínio (ou IP da VPS)
#    - Confirme as configurações
#    - Aguarde a instalação completa
```

## 🔧 **PASSO 3: CONFIGURAÇÃO PÓS-INSTALAÇÃO**

### **3.1 Verificar Status**

```bash
# 1. Verificar serviços
pm2 status

# 2. Verificar logs
pm2 logs --lines 50

# 3. Verificar portas
sudo netstat -tlnp | grep -E ':(80|443|3000|3001)'

# 4. Verificar uso de recursos
htop
df -h
free -h
```

### **3.2 Configurar Domínio (Opcional)**

Se você tem um domínio:

```bash
# 1. Editar configuração Nginx
sudo nano /etc/nginx/sites-available/flowchat-br

# 2. Substituir 'seu-dominio.com' pelo domínio real
server_name seu-dominio.com www.seu-dominio.com;

# 3. Recarregar Nginx
sudo systemctl reload nginx

# 4. Renovar SSL
sudo certbot renew --force-renewal
```

### **3.3 Acesso ao Sistema**

```bash
# URL de acesso
http://IP_DA_SUA_VPS
# ou
https://seu-dominio.com

# Credenciais (serão solicitadas na instalação)
# Email: admin@seu-dominio.com
# Senha: (definida durante instalação)
```

## 📊 **PASSO 4: MONITORAMENTO**

### **4.1 Comandos Úteis**

```bash
# Status dos serviços
pm2 status
pm2 logs --lines 100

# Uso de recursos
htop
df -h
free -h

# Logs do sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f

# Verificar versões
node --version
npm --version
docker --version
nginx -v
```

### **4.2 Backup Automático**

```bash
# 1. Criar script de backup
sudo nano /opt/flowchat-br/backup.sh

# 2. Conteúdo do script:
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

# 3. Dar permissão e agendar
chmod +x /opt/flowchat-br/backup.sh
sudo crontab -e

# Adicionar linha para backup diário às 2h:
0 2 * * * /opt/flowchat-br/backup.sh
```

## 🔄 **PASSO 5: ATUALIZAÇÕES**

### **5.1 Atualizar Código**

```bash
# 1. Parar serviços
pm2 stop all

# 2. Fazer backup
./backup.sh

# 3. Atualizar código
git pull origin main

# 4. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 5. Build
cd ../backend && npm run build
cd ../frontend && npm run build

# 6. Reiniciar serviços
pm2 restart all
```

### **5.2 Atualização Automática**

```bash
# Usar o instalador para atualizar
cd /opt/flowchat-br/instalador-main
./install_primaria
# Selecionar opção "Atualizar"
```

## 🛠️ **TROUBLESHOOTING**

### **Problemas Comuns**

#### **1. Erro de Porta em Uso**
```bash
# Verificar portas
sudo netstat -tlnp | grep :3000

# Matar processo
sudo kill -9 PID_DO_PROCESSO
```

#### **2. Erro de Permissão**
```bash
# Corrigir permissões
sudo chown -R $USER:$USER /opt/flowchat-br
chmod +x instalador-main/install_primaria
```

#### **3. Erro de Banco de Dados**
```bash
# Verificar status PostgreSQL
sudo systemctl status postgresql

# Reiniciar serviço
sudo systemctl restart postgresql
```

#### **4. Erro de SSL**
```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar configuração Nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 📱 **PASSO 6: ACESSO MOBILE**

### **PWA (Progressive Web App)**

O sistema é totalmente responsivo e pode ser instalado como PWA:

1. Acesse pelo navegador mobile: `https://seu-dominio.com`
2. Toque em "Adicionar à tela inicial"
3. O app será instalado como aplicativo nativo

### **Funcionalidades Mobile**

- ✅ Interface adaptativa
- ✅ Touch gestures
- ✅ Notificações push
- ✅ Modo offline básico
- ✅ Swipe para navegação

## 🎨 **PASSO 7: PERSONALIZAÇÃO**

### **Cores e Tema**

```bash
# Editar cores (se necessário)
nano frontend/src/styles/flowchat-design-system.css

# Cores atuais:
--primary-color: #009B3A;    /* Verde Brasileiro */
--secondary-color: #0066CC;  /* Azul Moderno */
--accent-color: #25D366;     /* Verde WhatsApp */
```

### **Logo Personalizado**

```bash
# Substituir logo
cp seu-logo.png frontend/public/logo.png
cp seu-logo.png frontend/src/assets/logo.png

# Rebuild
cd frontend && npm run build
pm2 restart all
```

## 📞 **SUPORTE**

### **Logs Importantes**

```bash
# Logs do aplicativo
pm2 logs --lines 200

# Logs do sistema
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f

# Logs de erro
tail -f /var/log/nginx/error.log
```

### **Informações do Sistema**

```bash
# Versões instaladas
node --version
npm --version
docker --version
nginx -v
psql --version
redis-server --version
```

## 🎉 **CONCLUSÃO**

### **Resumo do Processo**

1. ✅ **Preparar projeto** para GitHub
2. ✅ **Criar repositório** no GitHub
3. ✅ **Enviar código** para GitHub
4. ✅ **Conectar na VPS** via SSH
5. ✅ **Baixar projeto** do GitHub
6. ✅ **Executar instalador** automático
7. ✅ **Configurar domínio** (opcional)
8. ✅ **Acessar sistema** funcionando

### **Tempo Total Estimado**

- ⏱️ **Preparação GitHub**: 10 minutos
- ⏱️ **Conectar VPS**: 2 minutos
- ⏱️ **Download**: 2 minutos
- ⏱️ **Instalação**: 15-20 minutos
- ⏱️ **Configuração**: 5 minutos
- **Total**: ~35 minutos

### **Resultado Final**

O **FlowChatBR** estará funcionando na sua VPS com:

✅ **Design ultra moderno** brasileiro  
✅ **Interface responsiva** para todos os dispositivos  
✅ **Sistema de leads expandido** com 50+ campos  
✅ **Chat modernizado** com experiência premium  
✅ **Dashboard renovado** com métricas animadas  
✅ **SSL automático** com Let's Encrypt  
✅ **Backup automático** diário  
✅ **Monitoramento** completo  

**O FlowChatBR está pronto para revolucionar o atendimento WhatsApp na sua VPS! 🇧🇷🚀** 