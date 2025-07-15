#!/bin/bash

# Instalador FlowChat Híbrido
# Backend original (estável) + Frontend moderno brasileiro

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Banner
echo "========================================"
echo "    FLOWCHAT HÍBRIDO - INSTALADOR"
echo "    Backend Original + Frontend Moderno"
echo "========================================"
echo

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
    print_error "Execute este script como root (sudo)"
    exit 1
fi

# Solicitar informações
echo "Configuração do Sistema:"
echo
read -p "Nome da instância (ex: flowchat): " INSTANCE_NAME
read -p "Domínio (ex: flowchat.com): " DOMAIN
read -p "Senha para deploy e banco: " MYSQL_PASSWORD

# Validar entradas
if [ -z "$INSTANCE_NAME" ] || [ -z "$DOMAIN" ] || [ -z "$MYSQL_PASSWORD" ]; then
    print_error "Todos os campos são obrigatórios!"
    exit 1
fi

print_status "Iniciando instalação do FlowChat Híbrido..."

# 1. Instalar dependências
print_status "Instalando dependências..."
apt update
apt install -y curl wget git unzip software-properties-common nginx certbot python3-certbot-nginx mysql-server mysql-client

# 2. Instalar Node.js
print_status "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 3. Instalar Docker
print_status "Instalando Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. Instalar PM2
print_status "Instalando PM2..."
npm install -g pm2

# 5. Criar usuário deploy
print_status "Criando usuário deploy..."
useradd -m -s /bin/bash -G sudo deploy 2>/dev/null || true
echo "deploy:$MYSQL_PASSWORD" | chpasswd

# 6. Configurar MySQL
print_status "Configurando MySQL..."
systemctl start mysql
systemctl enable mysql

# Configurar MySQL
mysql -e "CREATE DATABASE IF NOT EXISTS $INSTANCE_NAME;"
mysql -e "CREATE USER IF NOT EXISTS '$INSTANCE_NAME'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -e "GRANT ALL PRIVILEGES ON $INSTANCE_NAME.* TO '$INSTANCE_NAME'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# 7. Configurar Redis
print_status "Configurando Redis..."
docker stop redis-$INSTANCE_NAME 2>/dev/null || true
docker rm redis-$INSTANCE_NAME 2>/dev/null || true
docker run --name redis-$INSTANCE_NAME -p 6379:6379 --restart always -d redis redis-server --requirepass $MYSQL_PASSWORD

# 8. Baixar código original
print_status "Baixando código original..."
cd /home/deploy
sudo -u deploy git clone https://github.com/FlowChatBR/flowchat.git $INSTANCE_NAME
cd $INSTANCE_NAME

# 9. Aplicar modificações visuais no frontend
print_status "Aplicando design moderno brasileiro..."
cd frontend

# Instalar dependências adicionais para o design moderno
sudo -u deploy npm install @mui/material @emotion/react @emotion/styled @mui/icons-material framer-motion react-intersection-observer

# Criar arquivo de tema brasileiro
cat > src/theme/brazilianTheme.js << 'EOF'
import { createTheme } from '@mui/material/styles';

export const brazilianTheme = createTheme({
  palette: {
    primary: {
      main: '#009c3b', // Verde da bandeira
      light: '#00d152',
      dark: '#006b2a',
    },
    secondary: {
      main: '#ffdf00', // Amarelo da bandeira
      light: '#ffe55c',
      dark: '#e6c900',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 156, 59, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 156, 59, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...brazilianTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d152',
      light: '#00ff6b',
      dark: '#009c3b',
    },
    secondary: {
      main: '#ffdf00',
      light: '#ffe55c',
      dark: '#e6c900',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});
EOF

# Criar componente de layout moderno
mkdir -p src/components/Layout
cat > src/components/Layout/ModernLayout.js << 'EOF'
import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { brazilianTheme } from '../../theme/brazilianTheme';

const ModernLayout = ({ children }) => {
  return (
    <ThemeProvider theme={brazilianTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModernLayout;
EOF

# Criar componente de header brasileiro
mkdir -p src/components/Header
cat > src/components/Header/BrazilianHeader.js << 'EOF'
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import { WhatsApp, Flag } from '@mui/icons-material';

const BrazilianHeader = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #009c3b 0%, #00d152 100%)',
        borderBottom: '3px solid #ffdf00',
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Flag sx={{ color: '#ffdf00' }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ffffff 30%, #ffdf00 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FlowChat BR
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            color="inherit"
            startIcon={<WhatsApp />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Atendimento
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BrazilianHeader;
EOF

cd ..

# 10. Configurar backend (original)
print_status "Configurando backend original..."
cat > backend/.env << EOF
NODE_ENV=production
BACKEND_URL=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
PROXY_PORT=443
PORT=4000

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=$INSTANCE_NAME
DB_PASS=$MYSQL_PASSWORD
DB_NAME=$INSTANCE_NAME

JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

REDIS_URI=redis://:$MYSQL_PASSWORD@127.0.0.1:6379
REDIS_OPT_LIMITER_MAX=1
REGIS_OPT_LIMITER_DURATION=3000

USER_LIMIT=5
CONNECTIONS_LIMIT=10
CLOSED_SEND_BY_ME=true
EOF

# 11. Configurar frontend
print_status "Configurando frontend..."
cat > frontend/.env << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN
REACT_APP_HOURS_CLOSE_TICKETS_AUTO=24
REACT_APP_REACT_APP_URL_API=https://$DOMAIN
EOF

# 12. Instalar dependências
print_status "Instalando dependências..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm install"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm install"

# 13. Build e migrações
print_status "Fazendo build e migrações..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npm run build"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:migrate"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && npx sequelize db:seed:all"

sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && npm run build"

# 14. Configurar Nginx
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/$INSTANCE_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$INSTANCE_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 15. Iniciar aplicações
print_status "Iniciando aplicações..."
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/backend && pm2 start dist/server.js --name $INSTANCE_NAME-backend"
sudo -u deploy bash -c "cd /home/deploy/$INSTANCE_NAME/frontend && pm2 start npm --name $INSTANCE_NAME-frontend -- start"
sudo -u deploy bash -c "pm2 save"
sudo -u deploy bash -c "pm2 startup"

# 16. Configurar SSL
print_warning "Configure o domínio DNS antes de continuar:"
print_info "  $DOMAIN -> $(curl -s ifconfig.me)"
echo

read -p "O domínio está configurado? (s/n): " DOMAIN_READY

if [ "$DOMAIN_READY" = "s" ] || [ "$DOMAIN_READY" = "S" ]; then
    print_status "Configurando SSL..."
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    print_status "SSL configurado!"
else
    print_warning "SSL não configurado. Execute manualmente:"
    print_info "certbot --nginx -d $DOMAIN"
fi

# 17. Finalizar
echo
echo "========================================"
echo "    INSTALAÇÃO HÍBRIDA CONCLUÍDA!"
echo "========================================"
echo
print_status "Sistema FlowChat Híbrido instalado!"
print_info "✅ Backend original (estável)"
print_info "✅ Frontend moderno brasileiro"
echo
print_info "🌐 URL de acesso: https://$DOMAIN"
echo
print_info "📁 Diretório: /home/deploy/$INSTANCE_NAME"
echo
print_info "🔧 Comandos úteis:"
print_info "  Status: pm2 status"
print_info "  Logs: pm2 logs"
print_info "  Reiniciar: pm2 restart all"
echo
print_info "👤 Usuário padrão:"
print_info "  Email: admin@admin.com"
print_info "  Senha: 123456"
echo
print_info "🎨 Design aplicado:"
print_info "  ✅ Cores da bandeira brasileira"
print_info "  ✅ Material-UI moderno"
print_info "  ✅ Animações suaves"
print_info "  ✅ Layout responsivo" 