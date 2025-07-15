# 🚀 FLOWCHAT BR - Sistema de Atendimento WhatsApp Modernizado

## 📋 **DESCRIÇÃO**

Sistema de atendimento WhatsApp **completamente sem filas**, com design ultra moderno inspirado no FlowChatBR. O cliente envia mensagem e vai direto para atendimento, sem menus ou seleção de departamentos.

## ✨ **CARACTERÍSTICAS**

### 🎨 **Design Moderno**
- **Cores brasileiras**: Verde, azul, verde WhatsApp
- **Glassmorphism**: Efeitos de vidro e transparência
- **Dark/Light Mode**: Tema escuro e claro
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Animações**: Transições suaves e modernas

### 🔧 **Funcionalidades**
- **Atendimento Direto**: Sem filas, sem menus, sem seleção de departamentos
- **Integrações**: Dialogflow, OpenAI, N8N, Typebot
- **Chatbot**: Configurável diretamente no WhatsApp
- **Mensagens Automáticas**: Boas-vindas, despedida, fora do horário
- **Multi-WhatsApp**: Suporte a múltiplas conexões
- **Relatórios**: Estatísticas e métricas completas

## 🚀 **INSTALAÇÃO RÁPIDA**

### **Opção 1: Instalação Automática (Recomendado)**

#### **Windows (Enviar para GitHub)**
```bash
# Execute o script automático
enviar-para-github.bat
```

#### **Linux/VPS (Instalar com Subdomínios)**
```bash
# Baixe o script
wget https://raw.githubusercontent.com/bastos2026/flowchat-br/main/instalar-vps.sh

# Execute como root
sudo chmod +x instalar-vps.sh
sudo ./instalar-vps.sh
```

**O script irá solicitar:**
- Seu domínio principal (ex: flowchatbr.com)
- Diretório de instalação (ex: /home/deploy/FlowChatBR)

**Configurará automaticamente:**
- 🌐 **Frontend**: https://app.flowchatbr.com
- 🔧 **Backend**: https://api.flowchatbr.com
- 🏠 **Principal**: https://flowchatbr.com
- 🔒 **SSL**: Certificados Let's Encrypt automáticos

### **Opção 2: Instalação Manual**

#### **1. Pré-requisitos**
- Ubuntu 22.04 ou superior
- Docker e Docker Compose
- Node.js 18+
- Git

#### **2. Clonar Repositório**
```bash
git clone https://github.com/bastos2026/flowchat-br.git
cd flowchat-br
```

#### **3. Executar Instalador**
```bash
cd instalador-main
chmod +x install.sh
./install.sh
```

## 📱 **COMO FUNCIONA**

### **Fluxo do Cliente**
```
Cliente: "Olá"
Sistema: "Bem-vindo! Como posso ajudar?"
Sistema: Direciona automaticamente para atendimento
```

### **Fluxo do Atendente**
```
Atendente recebe notificação
Atendente responde normalmente
Sistema mantém histórico completo
```

## ⚙️ **CONFIGURAÇÃO**

### **🌐 Configuração de Domínios**
Antes de começar, configure os registros DNS no seu provedor de domínio:

```
app.flowchatbr.com    A    SEU_IP_VPS
api.flowchatbr.com    A    SEU_IP_VPS
flowchatbr.com        A    SEU_IP_VPS
```

**📖 Guia completo**: [configurar-dominios.md](configurar-dominios.md)

### **1. Conectar WhatsApp**
1. Acesse o painel: `https://app.flowchatbr.com`
2. Vá em **Conexões** → **Nova Conexão**
3. Escaneie o QR Code com seu WhatsApp

### **2. Configurar Integrações**
1. **Dialogflow**: Configure no painel de integrações
2. **OpenAI**: Adicione sua API key
3. **N8N**: Configure webhooks
4. **Typebot**: Adicione URL do typebot

### **3. Mensagens Automáticas**
1. Configure mensagem de boas-vindas
2. Configure mensagem de despedida
3. Configure horário de funcionamento

## 🔧 **COMANDOS ÚTEIS**

### **Verificar Status**
```bash
docker-compose ps
```

### **Ver Logs**
```bash
docker-compose logs -f
```

### **Reiniciar Sistema**
```bash
docker-compose restart
```

### **Parar Sistema**
```bash
docker-compose down
```

### **Iniciar Sistema**
```bash
docker-compose up -d
```

## 📊 **ESTRUTURA DO PROJETO**

```
flowchat-br/
├── codatendechat-main/          # Código principal
│   ├── backend/                 # API e serviços
│   └── frontend/                # Interface web
├── instalador-main/             # Scripts de instalação
├── enviar-para-github.bat       # Script Windows
├── instalar-vps.sh              # Script Linux/VPS
├── configurar-dominios.md       # Guia DNS
└── README.md                    # Este arquivo
```

## 🌐 **URLS DE ACESSO**

Após a instalação, o sistema estará disponível em:

- **🌐 Frontend (Painel)**: https://app.flowchatbr.com
- **🔧 Backend (API)**: https://api.flowchatbr.com  
- **🏠 Domínio Principal**: https://flowchatbr.com
- **📁 Diretório**: /home/deploy/FlowChatBR

## 🆚 **DIFERENÇAS DO SISTEMA ORIGINAL**

### **ANTES (Com Filas)**
- Cliente escolhia departamento
- Menu de seleção obrigatório
- Sistema complexo de filas
- Transferências automáticas

### **DEPOIS (Sem Filas)**
- Atendimento direto
- Sem menus ou seleções
- Sistema simplificado
- Fluxo mais rápido

## 🐛 **SUPORTE**

### **Problemas Comuns**

#### **WhatsApp não conecta**
- Verifique se o número está ativo
- Tente reconectar o WhatsApp
- Verifique logs: `docker-compose logs -f`

#### **Sistema não inicia**
- Verifique se Docker está rodando
- Verifique portas 3000, 8080, 3306
- Execute: `docker-compose down && docker-compose up -d`

#### **Erro de banco de dados**
- Verifique se MySQL está rodando
- Execute: `docker-compose restart mysql`

## 📞 **CONTATO**

- **GitHub**: [bastos2026/flowchat-br](https://github.com/bastos2026/flowchat-br)
- **Issues**: [Reportar problemas](https://github.com/bastos2026/flowchat-br/issues)

## 📄 **LICENÇA**

Este projeto é baseado no sistema original de atendimento WhatsApp, modificado para remover o sistema de filas e modernizar a interface.

---

**Desenvolvido com ❤️ para o mercado brasileiro** 