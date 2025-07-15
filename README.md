# 🚀 FlowChat BR - Sistema de Atendimento WhatsApp Moderno

Sistema de atendimento WhatsApp com design moderno brasileiro, cores da bandeira nacional e interface responsiva.

## 🇧🇷 Características

- ✅ **Backend estável** (MySQL + Redis)
- ✅ **Frontend moderno** (Material-UI + cores brasileiras)
- ✅ **Sistema de filas** funcionando
- ✅ **Design responsivo** para mobile
- ✅ **SSL automático** (Let's Encrypt)
- ✅ **Instalação simplificada** (1 comando)

## 🎨 Design Brasileiro

- **Cores da bandeira**: Verde (#009c3b) e Amarelo (#ffdf00)
- **Material-UI** moderno e responsivo
- **Animações suaves** com Framer Motion
- **Tema escuro/claro** automático
- **Layout glassmorphism** com gradientes

## 📋 Pré-requisitos

- **VPS Ubuntu 22.04** (2GB RAM, 20GB SSD)
- **Domínio** configurado
- **Acesso root** à VPS

## 🚀 Instalação Rápida

### 1. Preparar Repositório
```bash
# Configurar Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: flowchat-br
# Público: ✅
```

### 2. Enviar Código
```bash
git init
git add .
git commit -m "Primeira versão: FlowChat BR"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/flowchat-br.git
git push -u origin main
```

### 3. Instalar na VPS
```bash
# Conectar na VPS
ssh root@IP_DA_VPS

# Atualizar sistema
apt update && apt upgrade -y

# Baixar e executar instalador
wget https://raw.githubusercontent.com/SEU_USUARIO/flowchat-br/main/install-hybrid.sh
chmod +x install-hybrid.sh
./install-hybrid.sh
```

## 🌐 Configuração DNS

Configure no seu provedor de domínio:
```
Tipo: A
Nome: @
Valor: IP_DA_VPS
TTL: 300
```

## ✅ Acesso ao Sistema

- **URL**: https://seudominio.com
- **Login**: admin@admin.com
- **Senha**: 123456

## 🔧 Comandos Úteis

```bash
# Status dos serviços
pm2 status

# Reiniciar aplicações
pm2 restart all

# Ver logs
pm2 logs

# Backup do banco
mysqldump -u flowchat -p flowchat > backup.sql
```

## 📚 Documentação Completa

Consulte o [GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md) para instruções detalhadas.

## 🚨 Solução de Problemas

### Erro de Permissão
```bash
chown -R deploy:deploy /home/deploy/flowchat
```

### Erro de SSL
```bash
certbot --nginx -d seudominio.com
```

### Verificar Status
```bash
systemctl status nginx mysql
docker ps | grep redis
pm2 status
```

## 📞 Suporte

- **Documentação**: [GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md)
- **Issues**: GitHub Issues
- **Logs**: `/home/deploy/flowchat/backend/logs/`

## 🎯 Funcionalidades

- **Conexão WhatsApp** via QR Code
- **Sistema de filas** para atendimento
- **Chat em tempo real** com WebSocket
- **Gestão de contatos** e conversas
- **Relatórios** e estatísticas
- **Integração com APIs** externas
- **Backup automático** do banco
- **Monitoramento** com PM2

## 🔒 Segurança

- **SSL/TLS** automático (Let's Encrypt)
- **Autenticação JWT** segura
- **Rate limiting** configurado
- **Firewall** recomendado
- **Backup** regular do banco

## 📱 Responsividade

- **Mobile-first** design
- **PWA** (Progressive Web App)
- **Offline** capability
- **Push notifications**
- **Touch-friendly** interface

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 