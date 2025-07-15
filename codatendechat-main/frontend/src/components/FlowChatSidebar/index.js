import React, { useState, useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
} from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Queue as QueueIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  FileCopy as FileCopyIcon,
  Tag as TagIcon,
  Folder as FolderIcon,
  Message as MessageIcon,
  Webhook as WebhookIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useLocation } from "react-router-dom";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  drawer: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "var(--shadow-glass)",
  },
  drawerPaper: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "var(--shadow-glass)",
    width: 280,
    transition: "var(--transition-normal)",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: 320,
    },
  },
  drawerPaperCollapsed: {
    width: 70,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      maxWidth: 320,
    },
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "var(--spacing-md)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    textDecoration: "none",
    color: "inherit",
  },
  logoIcon: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-light)",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  collapseButton: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--text-primary)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
    },
  },
  list: {
    padding: "var(--spacing-sm)",
  },
  listItem: {
    borderRadius: "var(--border-radius-sm)",
    margin: "var(--spacing-xs) 0",
    transition: "var(--transition-normal)",
    "&:hover": {
      background: "var(--bg-glass)",
      transform: "translateX(5px)",
    },
  },
  listItemActive: {
    background: "var(--color-primary)",
    color: "var(--text-light)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
    },
  },
  listItemIcon: {
    color: "inherit",
    minWidth: 40,
  },
  listItemText: {
    "& .MuiListItemText-primary": {
      fontSize: 14,
      fontWeight: 500,
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  badge: {
    "& .MuiBadge-badge": {
      background: "var(--color-danger)",
      color: "var(--text-light)",
      fontSize: 10,
      fontWeight: "bold",
    },
  },
  sectionTitle: {
    padding: "var(--spacing-sm) var(--spacing-md)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    margin: "var(--spacing-sm) 0",
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const FlowChatSidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const location = useLocation();
  
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleSubmenuToggle = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigation = (path) => {
    history.push(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const menuItems = [
    {
      section: "Principal",
      items: [
        {
          label: i18n.t("mainDrawer.listItems.dashboard"),
          icon: <DashboardIcon />,
          path: "/tickets",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.tickets"),
          icon: <ChatIcon />,
          path: "/tickets",
          badge: 12,
        },
        {
          label: i18n.t("mainDrawer.listItems.contacts"),
          icon: <PeopleIcon />,
          path: "/contacts",
          badge: null,
        },
      ],
    },
    {
      section: "Marketing",
      items: [
        {
          label: i18n.t("mainDrawer.listItems.campaigns"),
          icon: <CampaignIcon />,
          path: "/campaigns",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.flowBuilder"),
          icon: <MessageIcon />,
          path: "/flowbuilder",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.schedules"),
          icon: <ScheduleIcon />,
          path: "/schedules",
          badge: null,
        },
      ],
    },
    {
      section: "Gestão",
      items: [
        {
          label: i18n.t("mainDrawer.listItems.queues"),
          icon: <QueueIcon />,
          path: "/queues",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.users"),
          icon: <PeopleIcon />,
          path: "/users",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.companies"),
          icon: <BusinessIcon />,
          path: "/companies",
          badge: null,
        },
      ],
    },
    {
      section: "Relatórios",
      items: [
        {
          label: i18n.t("mainDrawer.listItems.reports"),
          icon: <AssessmentIcon />,
          path: "/reports",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.files"),
          icon: <FolderIcon />,
          path: "/files",
          badge: null,
        },
      ],
    },
    {
      section: "Configurações",
      items: [
        {
          label: i18n.t("mainDrawer.listItems.settings"),
          icon: <SettingsIcon />,
          path: "/settings",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.tags"),
          icon: <TagIcon />,
          path: "/tags",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.quickMessages"),
          icon: <FileCopyIcon />,
          path: "/quickmessages",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.webhooks"),
          icon: <WebhookIcon />,
          path: "/webhooks",
          badge: null,
        },
        {
          label: i18n.t("mainDrawer.listItems.help"),
          icon: <HelpIcon />,
          path: "/help",
          badge: null,
        },
      ],
    },
  ];

  const renderMenuItem = (item, index) => (
    <ListItem
      key={index}
      button
      className={`${classes.listItem} ${
        isActive(item.path) ? classes.listItemActive : ""
      }`}
      onClick={() => handleNavigation(item.path)}
    >
      <ListItemIcon className={classes.listItemIcon}>
        {item.badge ? (
          <Badge badgeContent={item.badge} className={classes.badge}>
            {item.icon}
          </Badge>
        ) : (
          item.icon
        )}
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.label}
          className={classes.listItemText}
        />
      )}
    </ListItem>
  );

  const renderSection = (section, sectionIndex) => (
    <div key={sectionIndex}>
      {!collapsed && (
        <Typography className={classes.sectionTitle}>
          {section.section}
        </Typography>
      )}
      <List component="div" disablePadding>
        {section.items.map((item, itemIndex) =>
          renderMenuItem(item, `${sectionIndex}-${itemIndex}`)
        )}
      </List>
      {sectionIndex < menuItems.length - 1 && !collapsed && (
        <Divider className={classes.divider} />
      )}
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      className={classes.drawer}
      classes={{
        paper: `${classes.drawerPaper} ${
          collapsed ? classes.drawerPaperCollapsed : ""
        }`,
      }}
      ModalProps={{
        keepMounted: true, // Melhora performance em mobile
      }}
    >
      {/* Header da Sidebar */}
      <div className={classes.drawerHeader}>
        <a href="/tickets" className={classes.logo}>
          <div className={classes.logoIcon}>
            FC
          </div>
          {!collapsed && (
            <Typography className={classes.logoText}>
              FlowChatBR
            </Typography>
          )}
        </a>
        {!isMobile && (
          <IconButton
            className={classes.collapseButton}
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </div>

      {/* Lista de Menu */}
      <div className={classes.list}>
        {menuItems.map((section, index) => renderSection(section, index))}
      </div>
    </Drawer>
  );
};

export default FlowChatSidebar; 