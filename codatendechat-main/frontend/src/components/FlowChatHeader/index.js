import React, { useState, useContext } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Avatar, 
  Menu, 
  MenuItem, 
  Box,
  useTheme,
  useMediaQuery
} from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import ColorModeContext from "../../layout/themeContext";
import { useAuth } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  header: {
    background: "var(--bg-glass)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "var(--shadow-glass)",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 var(--spacing-xl)",
    [theme.breakpoints.down("sm")]: {
      padding: "0 var(--spacing-md)",
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    textDecoration: "none",
    color: "inherit",
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-light)",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  navLinks: {
    display: "flex",
    gap: theme.spacing(2),
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  navLink: {
    color: "var(--text-primary)",
    textDecoration: "none",
    padding: "var(--spacing-sm) var(--spacing-md)",
    borderRadius: "var(--border-radius)",
    transition: "var(--transition-normal)",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontWeight: 500,
    "&:hover": {
      background: "var(--bg-glass)",
      color: "var(--color-primary)",
      transform: "translateY(-2px)",
    },
  },
  navLinkActive: {
    background: "var(--color-primary)",
    color: "var(--text-light)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
    },
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  themeToggle: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--text-primary)",
    "&:hover": {
      background: "var(--color-primary)",
      color: "var(--text-light)",
      transform: "rotate(180deg)",
    },
  },
  notificationsButton: {
    background: "var(--bg-glass)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--text-primary)",
    "&:hover": {
      background: "var(--color-warning)",
      color: "var(--text-light)",
    },
  },
  userAvatar: {
    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
    cursor: "pointer",
    transition: "var(--transition-normal)",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "var(--shadow-lg)",
    },
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
  },
  mobileMenuButton: {
    display: "none",
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
}));

const FlowChatHeader = ({ currentPage, onMenuToggle }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { colorMode } = useContext(ColorModeContext);
  const { user, handleLogout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleUserMenuClose();
  };

  const navItems = [
    {
      label: i18n.t("mainDrawer.listItems.dashboard"),
      icon: <DashboardIcon />,
      path: "/tickets",
      active: currentPage === "dashboard",
    },
    {
      label: i18n.t("mainDrawer.listItems.tickets"),
      icon: <ChatIcon />,
      path: "/tickets",
      active: currentPage === "tickets",
    },
    {
      label: i18n.t("mainDrawer.listItems.contacts"),
      icon: <PeopleIcon />,
      path: "/contacts",
      active: currentPage === "contacts",
    },
  ];

  return (
    <AppBar position="sticky" className={classes.header} elevation={0}>
      <Toolbar className={classes.toolbar}>
        {/* Logo */}
        <a href="/tickets" className={classes.logo}>
          <div className={classes.logoIcon}>
            FC
          </div>
          <Typography className={classes.logoText}>
            FlowChatBR
          </Typography>
        </a>

        {/* Navegação Desktop */}
        <nav className={classes.navLinks}>
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`${classes.navLink} ${
                item.active ? classes.navLinkActive : ""
              }`}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>

        {/* Menu Mobile */}
        {isMobile && (
          <IconButton
            className={classes.mobileMenuButton}
            onClick={onMenuToggle}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Ações do Header */}
        <div className={classes.headerRight}>
          {/* Toggle Tema */}
          <IconButton
            className={classes.themeToggle}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.type === "dark" ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          {/* Notificações */}
          <IconButton
            className={classes.notificationsButton}
            onClick={handleNotificationsOpen}
            color="inherit"
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Menu do Usuário */}
          <IconButton
            className={classes.userAvatar}
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <Avatar className={classes.userAvatar}>
              {user?.name?.charAt(0)?.toUpperCase() || <AccountIcon />}
            </Avatar>
          </IconButton>

          {/* Menu Dropdown do Usuário */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: {
                background: "var(--bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--border-radius)",
                boxShadow: "var(--shadow-glass)",
              },
            }}
          >
            <MenuItem onClick={handleUserMenuClose} className={classes.menuItem}>
              <AccountIcon />
              {i18n.t("user.profile")}
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose} className={classes.menuItem}>
              <SettingsIcon />
              {i18n.t("user.settings")}
            </MenuItem>
            <MenuItem onClick={handleLogoutClick} className={classes.menuItem}>
              <LogoutIcon />
              {i18n.t("user.logout")}
            </MenuItem>
          </Menu>

          {/* Menu de Notificações */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: {
                background: "var(--bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--border-radius)",
                boxShadow: "var(--shadow-glass)",
                minWidth: 300,
              },
            }}
          >
            <Box p={2}>
              <Typography variant="h6" style={{ color: "var(--text-primary)" }}>
                {i18n.t("notifications.title")}
              </Typography>
            </Box>
            <MenuItem onClick={handleNotificationsClose} className={classes.menuItem}>
              <Typography variant="body2" style={{ color: "var(--text-secondary)" }}>
                {i18n.t("notifications.noNotifications")}
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default FlowChatHeader; 