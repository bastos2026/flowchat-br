import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Badge,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  Info as InfoIcon,
  Block as BlockIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--border-radius-lg)",
    height: "calc(100vh - 120px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  chatHeader: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "var(--spacing-md) var(--spacing-lg)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    color: "var(--text-light)",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: 0,
  },
  contactStatus: {
    fontSize: 12,
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--color-success)",
  },
  headerActions: {
    display: "flex",
    gap: theme.spacing(1),
  },
  actionButton: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--text-primary)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
    },
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    padding: "var(--spacing-lg)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  message: {
    maxWidth: "70%",
    padding: "var(--spacing-md)",
    borderRadius: "var(--border-radius-lg)",
    position: "relative",
    animation: "fadeInUp 0.3s ease-out",
    wordWrap: "break-word",
  },
  messageReceived: {
    background: "var(--bg-glass)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "var(--border-radius-sm)",
  },
  messageSent: {
    background: "linear-gradient(135deg, var(--color-whatsapp), #128c7e)",
    color: "var(--text-light)",
    alignSelf: "flex-end",
    borderBottomRightRadius: "var(--border-radius-sm)",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 1.4,
    marginBottom: "var(--spacing-xs)",
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "right",
  },
  messageStatus: {
    fontSize: 12,
    opacity: 0.7,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  chatInput: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "var(--spacing-md) var(--spacing-lg)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
  },
  inputField: {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      background: "var(--bg-glass)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "var(--border-radius)",
      "& fieldset": {
        border: "none",
      },
      "& input": {
        color: "var(--text-primary)",
        fontSize: 14,
      },
      "&:hover": {
        borderColor: "var(--color-primary)",
      },
      "&.Mui-focused": {
        borderColor: "var(--color-primary)",
        boxShadow: "0 0 0 3px rgba(0, 155, 58, 0.1)",
      },
    },
  },
  sendButton: {
    background: "var(--color-whatsapp)",
    color: "var(--text-light)",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition-normal)",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "var(--shadow)",
    },
  },
  inputActionButton: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--text-primary)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
    },
  },
  typingIndicator: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "var(--spacing-sm) var(--spacing-md)",
    background: "var(--bg-glass)",
    borderRadius: "var(--border-radius)",
    alignSelf: "flex-start",
    maxWidth: "fit-content",
  },
  typingDots: {
    display: "flex",
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--text-secondary)",
    animation: "typing 1.4s infinite ease-in-out",
    "&:nth-child(1)": {
      animationDelay: "-0.32s",
    },
    "&:nth-child(2)": {
      animationDelay: "-0.16s",
    },
  },
  messageMenu: {
    "& .MuiPaper-root": {
      background: "var(--bg-glass)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "var(--border-radius)",
    },
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
  },
  "@keyframes typing": {
    "0%, 80%, 100%": {
      transform: "scale(0.8)",
      opacity: 0.5,
    },
    "40%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
  "@keyframes fadeInUp": {
    from: {
      opacity: 0,
      transform: "translateY(10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

// Dados mockados para demonstração
const mockMessages = [
  {
    id: 1,
    text: "Olá! Gostaria de saber mais sobre seus serviços.",
    sender: "contact",
    timestamp: "10:30",
    status: "read",
  },
  {
    id: 2,
    text: "Olá! Claro, ficarei feliz em ajudar. Que tipo de serviço você está procurando?",
    sender: "user",
    timestamp: "10:31",
    status: "sent",
  },
  {
    id: 3,
    text: "Estou interessado em um sistema de gestão para minha empresa.",
    sender: "contact",
    timestamp: "10:32",
    status: "read",
  },
  {
    id: 4,
    text: "Perfeito! Temos várias opções. Qual o tamanho da sua empresa?",
    sender: "user",
    timestamp: "10:33",
    status: "delivered",
  },
  {
    id: 5,
    text: "Somos uma empresa com cerca de 50 funcionários.",
    sender: "contact",
    timestamp: "10:35",
    status: "read",
  },
];

const mockContact = {
  name: "João Silva",
  avatar: "JS",
  status: "online",
  lastSeen: "Agora",
  phone: "+55 11 99999-9999",
  email: "joao.silva@email.com",
};

const FlowChatChat = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sending",
      };

      setMessages([...messages, message]);
      setNewMessage("");

      // Simular resposta automática
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const response = {
            id: Date.now() + 1,
            text: "Obrigado pela mensagem! Vou analisar e retorno em breve.",
            sender: "contact",
            timestamp: new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "read",
          };
          setMessages((prev) => [...prev, response]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageMenu = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return "⏳";
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      default:
        return "";
    }
  };

  const Message = ({ message }) => (
    <div
      className={`${classes.message} ${
        message.sender === "user" ? classes.messageSent : classes.messageReceived
      }`}
    >
      <Typography className={classes.messageText}>{message.text}</Typography>
      <div className={classes.messageTime}>
        {message.timestamp}
        {message.sender === "user" && (
          <span className={classes.messageStatus}>
            {getStatusIcon(message.status)}
          </span>
        )}
      </div>
      {message.sender === "contact" && (
        <IconButton
          size="small"
          className={classes.actionButton}
          onClick={(e) => handleMessageMenu(e, message)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );

  return (
    <div className={classes.chatContainer}>
      {/* Header do Chat */}
      <div className={classes.chatHeader}>
        <Avatar className={classes.contactAvatar}>
          {mockContact.avatar}
        </Avatar>
        <div className={classes.contactInfo}>
          <Typography className={classes.contactName}>
            {mockContact.name}
          </Typography>
          <div className={classes.contactStatus}>
            <div className={classes.statusDot} />
            <span>{mockContact.status === "online" ? "Online" : mockContact.lastSeen}</span>
          </div>
        </div>
        <div className={classes.headerActions}>
          <Tooltip title="Ligar">
            <IconButton className={classes.actionButton}>
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Videoconferência">
            <IconButton className={classes.actionButton}>
              <VideoCallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Informações">
            <IconButton className={classes.actionButton}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Mensagens */}
      <div className={classes.chatMessages}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className={classes.typingIndicator}>
            <Typography variant="body2" color="textSecondary">
              {mockContact.name} está digitando
            </Typography>
            <div className={classes.typingDots}>
              <div className={classes.typingDot} />
              <div className={classes.typingDot} />
              <div className={classes.typingDot} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input do Chat */}
      <div className={classes.chatInput}>
        <Tooltip title="Anexar arquivo">
          <IconButton className={classes.inputActionButton}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        
        <TextField
          className={classes.inputField}
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          variant="outlined"
        />
        
        <Tooltip title="Emojis">
          <IconButton className={classes.inputActionButton}>
            <EmojiIcon />
          </IconButton>
        </Tooltip>
        
        <IconButton
          className={classes.sendButton}
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <SendIcon />
        </IconButton>
      </div>

      {/* Menu de Mensagem */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className={classes.messageMenu}
      >
        <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
          <SearchIcon fontSize="small" />
          Pesquisar
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
          <FilterIcon fontSize="small" />
          Filtrar
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
          <BlockIcon fontSize="small" />
          Bloquear
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
          <ArchiveIcon fontSize="small" />
          Arquivar
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className={classes.menuItem}>
          <DeleteIcon fontSize="small" />
          Excluir
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FlowChatChat; 