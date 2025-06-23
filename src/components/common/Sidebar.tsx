import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  People,
  Payment,
  HelpOutline,
  ChevronLeft,
  ChevronRight,
  Business,
  ExpandLess,
  ExpandMore,
  AccountCircle,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface MenuItemType {
  text: string;
  icon: React.ReactElement;
  path: string;
  children?: MenuItemType[];
}

interface SidebarProps {
  drawerWidth?: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  isOpen: boolean;
  onToggleCollapse?: () => void;
}

const menuItems: MenuItemType[] = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  {
    text: "User Management",
    icon: <People />,
    path: "/users",
    children: [
      { text: "User List", icon: <People />, path: "/users/list" },
      { text: "Add User", icon: <People />, path: "/users/add" },
    ],
  },
  { text: "Transactions", icon: <Payment />, path: "/transactions" },
];

const secondaryMenuItems: MenuItemType[] = [
  { text: "Hỗ trợ", icon: <HelpOutline />, path: "/support" },
];

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth = 280,
  mobileOpen,
  handleDrawerToggle,
  isOpen,
  onToggleCollapse,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const collapsedWidth = 64;
  const currentDrawerWidth =
    !isMobile && collapsed ? collapsedWidth : drawerWidth;

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) =>
            location.pathname === child.path ||
            (child.path !== "/" && location.pathname.startsWith(child.path))
        );
        if (hasActiveChild && !expandedItems.includes(item.text)) {
          setExpandedItems((prev) => [...prev, item.text]);
        }
      }
    });
  }, [location.pathname]);

  const handleCollapseToggle = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
      onToggleCollapse?.();
      if (!collapsed) {
        setExpandedItems([]);
      }
    }
  };

  const handleExpandClick = (itemText: string) => {
    if (collapsed) return;

    setExpandedItems((prev) =>
      prev.includes(itemText)
        ? prev.filter((item) => item !== itemText)
        : [...prev, itemText]
    );
  };

  const isPathActive = (itemPath: string) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(itemPath + "/")
    );
  };

  useEffect(() => {
    console.log(mobileOpen);
  }, [mobileOpen]);

  const renderMenuItem = (item: MenuItemType, _ = false) => {
    const isActive = isPathActive(item.path);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);
    const showChildren = hasChildren && isExpanded && !collapsed;

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
            <ListItemButton
              component={hasChildren ? "div" : NavLink}
              to={hasChildren ? undefined : item.path}
              selected={!hasChildren && isActive}
              onClick={() => {
                if (hasChildren) {
                  handleExpandClick(item.text);
                } else if (isMobile) {
                  handleDrawerToggle();
                }
              }}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 1 : 2,
                mx: 1,
                borderRadius: 1,
                transition: theme.transitions.create(
                  ["background-color", "color"],
                  {
                    duration: theme.transitions.duration.shortest,
                  }
                ),
                "&.Mui-selected, &.active": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.contrastText,
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      variant: "body2",
                      noWrap: true,
                    }}
                  />
                  {hasChildren && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpandClick(item.text);
                      }}
                      sx={{ color: "inherit" }}
                    >
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {showChildren && (
          <Collapse in={showChildren} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => (
                <ListItem
                  key={child.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    component={NavLink}
                    to={child.path}
                    selected={isPathActive(child.path)}
                    onClick={isMobile ? handleDrawerToggle : undefined}
                    sx={{
                      minHeight: 40,
                      pl: 4,
                      pr: 2,
                      mx: 1,
                      borderRadius: 1,
                      "&.Mui-selected, &.active": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.primary.contrastText,
                        },
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          bgcolor: "currentColor",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={child.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        variant: "body2",
                        fontSize: "0.875rem",
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 1 : 2,
          minHeight: { xs: 56, sm: 64 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {!collapsed && (
          <Box
            sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}
          >
            <Business
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: "2rem",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              fontWeight="bold"
              color="text.primary"
            >
              Admin Panel
            </Typography>
          </Box>
        )}

        {collapsed && (
          <Business
            sx={{ color: theme.palette.primary.main, fontSize: "2rem" }}
          />
        )}

        {!isMobile && (
          <Tooltip
            title={collapsed ? "Mở rộng" : "Thu gọn"}
            placement="right"
            arrow
          >
            <IconButton
              onClick={handleCollapseToggle}
              size="small"
              sx={{
                color: "text.secondary",
                ml: collapsed ? 0 : 1,
              }}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>

        <Divider sx={{ mx: 1, my: 1 }} />

        <List sx={{ pb: 1 }}>
          {secondaryMenuItems.map((item) => renderMenuItem(item, true))}
        </List>
      </Box>

      {user && !collapsed && (
        <>
          <Divider />
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Avatar
              src=""
              alt={user.name || "User"}
              sx={{
                width: 36,
                height: 36,
                mr: 1.5,
                bgcolor: "primary.main",
                fontSize: "1rem",
              }}
            >
              {user.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <AccountCircle />
              )}
            </Avatar>
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography
                variant="subtitle2"
                noWrap
                fontWeight="600"
                color="text.primary"
                sx={{ lineHeight: 1.2 }}
              >
                {user.name || "Tên người dùng"}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                {user.email || "user@example.com"}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: isOpen ? currentDrawerWidth : 0 },
        flexShrink: { md: 0 },
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {isOpen && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: currentDrawerWidth,
              bgcolor: "background.paper",
              color: "text.primary",
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              position: "fixed",
              height: "100vh",
              zIndex: theme.zIndex.drawer,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
