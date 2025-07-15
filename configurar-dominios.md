# 🌐 Configuração de Domínios - FlowChatBR

## 📋 **Configuração DNS Necessária**

Para que o sistema funcione corretamente, você precisa configurar os seguintes registros DNS no seu provedor de domínio:

### **1. Registros A (Apontar para IP da VPS)**

```
app.flowchatbr.com    A    SEU_IP_VPS
api.flowchatbr.com    A    SEU_IP_VPS
flowchatbr.com        A    SEU_IP_VPS
```

### **2. Registros CNAME (Opcional - para www)**

```
www.flowchatbr.com    CNAME    flowchatbr.com
```

---

## 🔧 **Como Configurar em Provedores Comuns**

### **Cloudflare**
1. Acesse o painel do Cloudflare
2. Vá em **DNS** → **Records**
3. Adicione os registros:
   - **Type**: A
   - **Name**: app
   - **Content**: SEU_IP_VPS
   - **Proxy status**: DNS only (cinza)
4. Repita para `api` e domínio principal

### **GoDaddy**
1. Acesse o painel do GoDaddy
2. Vá em **Domains** → **Manage DNS**
3. Em **Records**, adicione:
   - **Type**: A
   - **Host**: app
   - **Points to**: SEU_IP_VPS
   - **TTL**: 600
4. Repita para `api` e domínio principal

### **Namecheap**
1. Acesse o painel do Namecheap
2. Vá em **Domain List** → **Manage** → **Advanced DNS**
3. Em **Host Records**, adicione:
   - **Type**: A Record
   - **Host**: app
   - **Value**: SEU_IP_VPS
   - **TTL**: Automatic
4. Repita para `api` e domínio principal

### **Google Domains**
1. Acesse o Google Domains
2. Vá em **DNS** → **Manage custom records**
3. Adicione os registros:
   - **Host name**: app
   - **Type**: A
   - **TTL**: 300
   - **Data**: SEU_IP_VPS
4. Repita para `api` e domínio principal

---

## ⏱️ **Tempo de Propagação**

- **DNS**: 5 minutos a 24 horas
- **SSL**: Imediato após propagação DNS
- **Recomendado**: Aguardar 1-2 horas antes de testar

---

## 🧪 **Como Testar**

### **1. Verificar DNS**
```bash
# No terminal
nslookup app.flowchatbr.com
nslookup api.flowchatbr.com
nslookup flowchatbr.com
```

### **2. Verificar SSL**
```bash
# Testar certificados
curl -I https://app.flowchatbr.com
curl -I https://api.flowchatbr.com
curl -I https://flowchatbr.com
```

### **3. Testar Acesso**
- Frontend: https://app.flowchatbr.com
- API: https://api.flowchatbr.com
- Principal: https://flowchatbr.com

---

## 🚨 **Problemas Comuns**

### **DNS não propagou**
- Aguarde mais tempo (até 24h)
- Verifique se os registros estão corretos
- Use ferramentas como [whatsmydns.net](https://whatsmydns.net)

### **SSL não funciona**
- Verifique se DNS propagou
- Execute: `certbot --nginx -d app.flowchatbr.com -d api.flowchatbr.com -d flowchatbr.com`

### **Erro 502 Bad Gateway**
- Verifique se o sistema está rodando: `docker-compose ps`
- Verifique logs: `docker-compose logs -f`

---

## 📞 **Suporte**

Se precisar de ajuda com a configuração DNS, entre em contato com seu provedor de domínio ou consulte a documentação deles. 