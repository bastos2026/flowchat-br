# 🚀 Como Enviar para GitHub - PASSO A PASSO

## ⚡ Método Rápido (Recomendado)

### 1. Execute o Script Automático
```bash
# Clique duas vezes no arquivo:
enviar-github.bat
```

### 2. Digite as Informações
- **Usuário GitHub**: `bastos2026`
- **Email**: `seu@email.com`
- **Nome**: `Seu Nome Completo`

### 3. Pronto! 🎉

---

## 🔧 Método Manual (Se o automático não funcionar)

### 1. Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. **Nome**: `flowchat-br`
3. **Descrição**: `Sistema de Atendimento WhatsApp Moderno`
4. **Público**: ✅ Marcar
5. **Criar repositório**

### 2. Configurar Git (PowerShell)
```powershell
# Abrir PowerShell como administrador
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### 3. Enviar Código
```powershell
# No diretório do projeto
git init
git add .
git commit -m "🚀 FlowChat BR - Sistema de Atendimento WhatsApp Moderno"
git branch -M main
git remote add origin https://github.com/bastos2026/flowchat-br.git
git push -u origin main
```

---

## 🚨 Se Der Erro de Autenticação

### Opção 1: Token de Acesso
1. Acesse: https://github.com/settings/tokens
2. **Generate new token** → **Classic**
3. **Note**: `FlowChat BR`
4. **Expiration**: `No expiration`
5. **Scopes**: ✅ `repo`
6. **Generate token**
7. Use o token como senha

### Opção 2: GitHub CLI
```powershell
# Instalar GitHub CLI
winget install GitHub.cli

# Fazer login
gh auth login

# Enviar código
gh repo create flowchat-br --public --source=. --remote=origin --push
```

---

## ✅ Verificar se Funcionou

1. Acesse: https://github.com/bastos2026/flowchat-br
2. Deve aparecer todos os arquivos
3. Copie a URL do repositório

---

## 🖥️ Instalar na VPS

Após enviar para GitHub, execute na VPS:

```bash
# Conectar na VPS
ssh root@IP_DA_VPS

# Atualizar sistema
apt update && apt upgrade -y

# Baixar instalador
wget https://raw.githubusercontent.com/bastos2026/flowchat-br/main/install-hybrid.sh

# Executar
chmod +x install-hybrid.sh
./install-hybrid.sh
```

---

## 🎯 Informações Durante Instalação

- **Nome da instância**: `flowchat`
- **Domínio**: `seudominio.com`
- **Senha**: `senha123`

---

## 🚀 Resultado Final

- **URL**: https://seudominio.com
- **Login**: admin@admin.com
- **Senha**: 123456

---

**Agora é só executar o `enviar-github.bat` e seguir as instruções!** 🎉 