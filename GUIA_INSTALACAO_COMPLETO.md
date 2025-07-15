# 🚀 Guia Completo de Instalação - FlowChat BR

## 📋 Pré-requisitos

- **VPS Ubuntu 22.04** (recomendado: 2GB RAM, 20GB SSD)
- **Domínio** configurado e apontando para o IP da VPS
- **Acesso root** à VPS

---

## 🔧 Passo 1: Preparar o Repositório

### 1.1 Configurar Git (Windows)
```bash
# Abrir PowerShell como administrador
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Criar repositório no GitHub
# 1. Acesse: https://github.com/new
# 2. Nome: flowchat-br
# 3. Descrição: Sistema de Atendimento WhatsApp Moderno
# 4. Marcar como Público
# 5. Criar repositório
```

### 1.2 Enviar Código para GitHub
```bash
# No diretório do projeto
git init
git add .
git commit -m "Primeira versão: FlowChat BR com design moderno"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/flowchat-br.git
git push -u origin main
```

---

## 🖥️ Passo 2: Instalar na VPS

### 2.1 Conectar na VPS
```bash
ssh root@IP_DA_VPS
```

### 2.2 Atualizar Sistema
```bash
apt update && apt upgrade -y
```

### 2.3 Baixar e Executar Instalador
```bash
# Baixar o instalador
wget https://raw.githubusercontent.com/SEU_USUARIO/flowchat-br/main/install-hybrid.sh

# Tornar executável
chmod +x install-hybrid.sh

# Executar instalação
./install-hybrid.sh
```

### 2.4 Informações Necessárias
Durante a instalação, você precisará fornecer:

- **Nome da instância**: `flowchat` (ou o nome que preferir)
- **Domínio**: `seudominio.com` (seu domínio real)
- **Senha**: `senha123` (senha para deploy e banco)

---

## 🌐 Passo 3: Configurar DNS

### 3.1 Configurar no seu provedor de domínio:

```
Tipo: A
Nome: @
Valor: IP_DA_VPS
TTL: 300
```

### 3.2 Verificar propagação:
```bash
# Na VPS, verificar IP
curl -s ifconfig.me

# Aguardar propagação (pode levar até 24h)
nslookup seudominio.com
```

---

## 🔒 Passo 4: Configurar SSL

### 4.1 Durante a instalação:
- Quando perguntar se o domínio está configurado, responder: `s`
- O SSL será configurado automaticamente

### 4.2 Manualmente (se necessário):
```bash
certbot --nginx -d seudominio.com --non-interactive --agree-tos --email admin@seudominio.com
```

---

## ✅ Passo 5: Verificar Instalação

### 5.1 Verificar Status dos Serviços
```bash
# Status do PM2
pm2 status

# Status do Nginx
systemctl status nginx

# Status do MySQL
systemctl status mysql

# Status do Redis
docker ps | grep redis
```

### 5.2 Verificar Logs
```bash
# Logs do backend
pm2 logs flowchat-backend

# Logs do frontend
pm2 logs flowchat-frontend

# Logs do Nginx
tail -f /var/log/nginx/error.log
```

---

## 🎯 Passo 6: Acessar o Sistema

### 6.1 URLs de Acesso
- **Sistema**: https://seudominio.com
- **API**: https://seudominio.com/api

### 6.2 Usuário Padrão
- **Email**: admin@admin.com
- **Senha**: 123456

### 6.3 Primeiro Acesso
1. Acesse https://seudominio.com
2. Faça login com as credenciais padrão
3. Configure sua primeira conexão WhatsApp
4. Personalize as configurações

---

## 🔧 Comandos Úteis

### Gerenciar Aplicações
```bash
# Ver status
pm2 status

# Reiniciar tudo
pm2 restart all

# Parar tudo
pm2 stop all

# Ver logs
pm2 logs

# Salvar configuração
pm2 save
```

### Backup e Restore
```bash
# Backup do banco
mysqldump -u flowchat -p flowchat > backup.sql

# Restore do banco
mysql -u flowchat -p flowchat < backup.sql
```

### Atualizações
```bash
# Atualizar código
cd /home/deploy/flowchat
git pull origin main

# Reinstalar dependências
sudo -u deploy bash -c "cd backend && npm install"
sudo -u deploy bash -c "cd frontend && npm install"

# Rebuild
sudo -u deploy bash -c "cd backend && npm run build"
sudo -u deploy bash -c "cd frontend && npm run build"

# Reiniciar
pm2 restart all
```

---

## 🚨 Solução de Problemas

### Erro de Permissão
```bash
# Corrigir permissões
chown -R deploy:deploy /home/deploy/flowchat
```

### Erro de Porta
```bash
# Verificar portas em uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :4000
```

### Erro de SSL
```bash
# Renovar certificado
certbot renew

# Verificar certificado
certbot certificates
```

### Erro de Banco
```bash
# Verificar MySQL
systemctl status mysql
mysql -u flowchat -p -e "SHOW DATABASES;"
```

---

## 📞 Suporte

### Logs Importantes
- **Backend**: `/home/deploy/flowchat/backend/logs/`
- **Frontend**: `pm2 logs flowchat-frontend`
- **Nginx**: `/var/log/nginx/`
- **MySQL**: `/var/log/mysql/`

### Contatos
- **Documentação**: README.md
- **Issues**: GitHub Issues
- **Comunidade**: Discord/Telegram

---

## 🎉 Instalação Concluída!

Seu sistema FlowChat BR está funcionando com:
- ✅ **Backend estável** (MySQL + Redis)
- ✅ **Frontend moderno** (cores brasileiras)
- ✅ **SSL configurado** (Let's Encrypt)
- ✅ **Sistema de filas** funcionando
- ✅ **Design responsivo** para mobile

**Acesse**: https://seudominio.com
**Login**: admin@admin.com / 123456

---

*Desenvolvido com ❤️ para o Brasil 🇧🇷* 