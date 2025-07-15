import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "var(--spacing-xl)",
    background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
    minHeight: "100vh",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "var(--spacing-xl)",
    textAlign: "center",
  },
  filtersContainer: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--border-radius-lg)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
    display: "flex",
    gap: "var(--spacing-lg)",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterItem: {
    minWidth: 200,
  },
  filterLabel: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  select: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "var(--border-radius)",
    "& .MuiSelect-select": {
      color: "var(--text-primary)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      background: "var(--bg-glass)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "var(--border-radius)",
      "& fieldset": {
        border: "none",
      },
      "& input": {
        color: "var(--text-primary)",
      },
    },
  },
  leadsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  leadCard: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "var(--border-radius-lg)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "var(--transition-normal)",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "var(--shadow-hover)",
    },
  },
  leadHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "var(--spacing-md)",
    padding: "var(--spacing-md)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  leadAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-light)",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: "var(--spacing-md)",
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: 18,
    fontWeight: 600,
  },
  leadUsername: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: 14,
  },
  leadValue: {
    background: "linear-gradient(135deg, var(--color-success), #20c997)",
    color: "var(--text-light)",
    padding: "var(--spacing-xs) var(--spacing-sm)",
    borderRadius: "var(--border-radius-sm)",
    fontWeight: "bold",
    fontSize: 14,
  },
  leadDetails: {
    padding: "var(--spacing-md)",
  },
  leadField: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-sm)",
    padding: "var(--spacing-xs) 0",
  },
  fieldLabel: {
    fontSize: 12,
    color: "var(--text-secondary)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    color: "var(--text-primary)",
    fontWeight: 500,
  },
  fieldLink: {
    color: "var(--color-primary)",
    textDecoration: "none",
    fontWeight: 500,
    "&:hover": {
      textDecoration: "underline",
    },
  },
  statusBadge: {
    padding: "2px var(--spacing-sm)",
    borderRadius: "var(--border-radius-sm)",
    fontSize: 12,
    fontWeight: 500,
    textAlign: "center",
  },
  statusNovo: {
    background: "var(--color-info)",
    color: "var(--text-light)",
  },
  statusContato: {
    background: "var(--color-warning)",
    color: "var(--text-primary)",
  },
  statusQualificado: {
    background: "var(--color-success)",
    color: "var(--text-light)",
  },
  statusConvertido: {
    background: "var(--color-primary)",
    color: "var(--text-light)",
  },
  originBadge: {
    background: "var(--color-info)",
    color: "var(--text-light)",
    padding: "2px var(--spacing-sm)",
    borderRadius: "var(--border-radius-sm)",
    fontSize: 12,
    fontWeight: 500,
    textAlign: "center",
  },
  leadActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "var(--spacing-md)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
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
  addButton: {
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    color: "var(--text-light)",
    padding: "var(--spacing-md) var(--spacing-xl)",
    borderRadius: "var(--border-radius)",
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition-normal)",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "var(--shadow-lg)",
    },
  },
  dialog: {
    "& .MuiDialog-paper": {
      background: "var(--bg-glass)",
      backdropFilter: "blur(20px)",
      borderRadius: "var(--border-radius-lg)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      minWidth: 600,
    },
  },
  dialogTitle: {
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    color: "var(--text-light)",
    padding: "var(--spacing-lg)",
  },
  dialogContent: {
    padding: "var(--spacing-xl)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  formField: {
    marginBottom: "var(--spacing-md)",
  },
}));

// Dados mockados para demonstração
const mockLeads = [
  {
    id: 1,
    nome: "João Silva",
    usuario: "joao.silva",
    telefone: "+55 11 99999-9999",
    email: "joao.silva@email.com",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    endereco: "Rua das Flores, 123",
    valor: 5000,
    valor_maximo: 8000,
    orcamento: 6000,
    origem: "Website",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "black_friday",
    status: "qualificado",
    etapa_funil: "Proposta Enviada",
    probabilidade_conversao: 75,
    interesse: "Software ERP",
    produto_interesse: "Sistema de Gestão",
    categoria_interesse: "Tecnologia",
    primeira_interacao: "2024-01-15",
    ultima_interacao: "2024-01-20",
    data_conversao: null,
    custom_fields: {
      empresa: "Tech Solutions Ltda",
      cargo: "Diretor de TI",
      funcionarios: 50,
      setor: "Tecnologia",
    },
  },
  {
    id: 2,
    nome: "Maria Santos",
    usuario: "maria.santos",
    telefone: "+55 21 88888-8888",
    email: "maria.santos@empresa.com",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "20000-000",
    endereco: "Av. Copacabana, 456",
    valor: 3000,
    valor_maximo: 5000,
    orcamento: 4000,
    origem: "LinkedIn",
    utm_source: "linkedin",
    utm_medium: "social",
    utm_campaign: "brand_awareness",
    status: "novo",
    etapa_funil: "Primeiro Contato",
    probabilidade_conversao: 25,
    interesse: "Consultoria",
    produto_interesse: "Consultoria Empresarial",
    categoria_interesse: "Serviços",
    primeira_interacao: "2024-01-18",
    ultima_interacao: "2024-01-18",
    data_conversao: null,
    custom_fields: {
      empresa: "Consultoria RJ",
      cargo: "CEO",
      funcionarios: 15,
      setor: "Consultoria",
    },
  },
  {
    id: 3,
    nome: "Pedro Costa",
    usuario: "pedro.costa",
    telefone: "+55 31 77777-7777",
    email: "pedro.costa@startup.com",
    cidade: "Belo Horizonte",
    estado: "MG",
    cep: "30000-000",
    endereco: "Rua da Inovação, 789",
    valor: 15000,
    valor_maximo: 25000,
    orcamento: 20000,
    origem: "Evento",
    utm_source: "evento",
    utm_medium: "offline",
    utm_campaign: "startup_week",
    status: "convertido",
    etapa_funil: "Fechado",
    probabilidade_conversao: 100,
    interesse: "Solução Completa",
    produto_interesse: "Plataforma SaaS",
    categoria_interesse: "SaaS",
    primeira_interacao: "2024-01-10",
    ultima_interacao: "2024-01-25",
    data_conversao: "2024-01-25",
    custom_fields: {
      empresa: "Startup MG",
      cargo: "Founder",
      funcionarios: 8,
      setor: "Fintech",
    },
  },
];

const FlowChatLeads = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const [leads, setLeads] = useState(mockLeads);
  const [filteredLeads, setFilteredLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [origemFilter, setOrigemFilter] = useState("todos");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, statusFilter, origemFilter, leads]);

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.telefone.includes(searchTerm) ||
          lead.usuario.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "todos") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (origemFilter !== "todos") {
      filtered = filtered.filter((lead) => lead.origem === origemFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setOpenDialog(true);
  };

  const handleDeleteLead = (leadId) => {
    setLeads(leads.filter((lead) => lead.id !== leadId));
    setAnchorEl(null);
  };

  const handleSaveLead = (leadData) => {
    if (editingLead) {
      setLeads(
        leads.map((lead) =>
          lead.id === editingLead.id ? { ...lead, ...leadData } : lead
        )
      );
    } else {
      const newLead = {
        ...leadData,
        id: Date.now(),
        primeira_interacao: new Date().toISOString().split("T")[0],
        ultima_interacao: new Date().toISOString().split("T")[0],
      };
      setLeads([...leads, newLead]);
    }
    setOpenDialog(false);
    setEditingLead(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "novo":
        return classes.statusNovo;
      case "contato":
        return classes.statusContato;
      case "qualificado":
        return classes.statusQualificado;
      case "convertido":
        return classes.statusConvertido;
      default:
        return classes.statusNovo;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const LeadCard = ({ lead }) => (
    <Card className={classes.leadCard}>
      <div className={classes.leadHeader}>
        <Avatar className={classes.leadAvatar}>
          {lead.nome.charAt(0).toUpperCase()}
        </Avatar>
        <div className={classes.leadInfo}>
          <Typography className={classes.leadName}>{lead.nome}</Typography>
          <Typography className={classes.leadUsername}>@{lead.usuario}</Typography>
        </div>
        <Typography className={classes.leadValue}>
          {formatCurrency(lead.valor)}
        </Typography>
      </div>

      <div className={classes.leadDetails}>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Telefone</span>
          <a href={`tel:${lead.telefone}`} className={classes.fieldLink}>
            {lead.telefone}
          </a>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Email</span>
          <a href={`mailto:${lead.email}`} className={classes.fieldLink}>
            {lead.email}
          </a>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Localização</span>
          <span className={classes.fieldValue}>
            {lead.cidade}, {lead.estado}
          </span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Origem</span>
          <span className={classes.originBadge}>{lead.origem}</span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Status</span>
          <span className={`${classes.statusBadge} ${getStatusClass(lead.status)}`}>
            {lead.status}
          </span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Probabilidade</span>
          <span className={classes.fieldValue}>{lead.probabilidade_conversao}%</span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Interesse</span>
          <span className={classes.fieldValue}>{lead.produto_interesse}</span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Empresa</span>
          <span className={classes.fieldValue}>{lead.custom_fields.empresa}</span>
        </div>
        <div className={classes.leadField}>
          <span className={classes.fieldLabel}>Cargo</span>
          <span className={classes.fieldValue}>{lead.custom_fields.cargo}</span>
        </div>
      </div>

      <div className={classes.leadActions}>
        <Button
          className={classes.actionButton}
          startIcon={<EditIcon />}
          onClick={() => handleEditLead(lead)}
        >
          Editar
        </Button>
        <IconButton
          className={classes.actionButton}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setSelectedLead(lead);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </div>
    </Card>
  );

  return (
    <div className={classes.container}>
      <Typography className={classes.pageTitle}>
        {i18n.t("leads.title")}
      </Typography>

      {/* Filtros */}
      <div className={classes.filtersContainer}>
        <div className={classes.filterItem}>
          <Typography className={classes.filterLabel}>
            Buscar
          </Typography>
          <TextField
            placeholder="Nome, email, telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={classes.textField}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon style={{ marginRight: 8, color: "var(--text-secondary)" }} />,
            }}
          />
        </div>

        <div className={classes.filterItem}>
          <Typography className={classes.filterLabel}>
            Status
          </Typography>
          <FormControl fullWidth>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={classes.select}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="novo">Novo</MenuItem>
              <MenuItem value="contato">Contato</MenuItem>
              <MenuItem value="qualificado">Qualificado</MenuItem>
              <MenuItem value="convertido">Convertido</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={classes.filterItem}>
          <Typography className={classes.filterLabel}>
            Origem
          </Typography>
          <FormControl fullWidth>
            <Select
              value={origemFilter}
              onChange={(e) => setOrigemFilter(e.target.value)}
              className={classes.select}
            >
              <MenuItem value="todos">Todas</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              <MenuItem value="Evento">Evento</MenuItem>
              <MenuItem value="Indicação">Indicação</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button
          className={classes.addButton}
          onClick={() => setOpenDialog(true)}
          startIcon={<AddIcon />}
        >
          Novo Lead
        </Button>
      </div>

      {/* Grid de Leads */}
      <div className={classes.leadsGrid}>
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

      {/* Menu de Ações */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            background: "var(--bg-glass)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--border-radius)",
          },
        }}
      >
        <MenuItem onClick={() => handleEditLead(selectedLead)}>
          <EditIcon style={{ marginRight: 8 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleDeleteLead(selectedLead?.id)}>
          <DeleteIcon style={{ marginRight: 8 }} />
          Excluir
        </MenuItem>
      </Menu>

      {/* Dialog de Edição/Criação */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        className={classes.dialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          {editingLead ? "Editar Lead" : "Novo Lead"}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.formGrid}>
            <div className={classes.formField}>
              <TextField
                label="Nome"
                defaultValue={editingLead?.nome || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Usuário"
                defaultValue={editingLead?.usuario || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Telefone"
                defaultValue={editingLead?.telefone || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Email"
                defaultValue={editingLead?.email || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Cidade"
                defaultValue={editingLead?.cidade || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Estado"
                defaultValue={editingLead?.estado || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <TextField
                label="Valor"
                type="number"
                defaultValue={editingLead?.valor || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
            <div className={classes.formField}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={editingLead?.status || "novo"}
                  className={classes.select}
                >
                  <MenuItem value="novo">Novo</MenuItem>
                  <MenuItem value="contato">Contato</MenuItem>
                  <MenuItem value="qualificado">Qualificado</MenuItem>
                  <MenuItem value="convertido">Convertido</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={classes.formField}>
              <FormControl fullWidth>
                <InputLabel>Origem</InputLabel>
                <Select
                  defaultValue={editingLead?.origem || "Website"}
                  className={classes.select}
                >
                  <MenuItem value="Website">Website</MenuItem>
                  <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                  <MenuItem value="Evento">Evento</MenuItem>
                  <MenuItem value="Indicação">Indicação</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={classes.formField}>
              <TextField
                label="Interesse"
                defaultValue={editingLead?.produto_interesse || ""}
                className={classes.textField}
                fullWidth
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: "var(--spacing-lg)" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            startIcon={<CancelIcon />}
            className={classes.actionButton}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleSaveLead({})}
            startIcon={<SaveIcon />}
            className="flowchat-btn flowchat-btn-primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FlowChatLeads; 