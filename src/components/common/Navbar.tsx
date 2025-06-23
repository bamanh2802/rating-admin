// src/components/layout/Navbar.tsx

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BreadcrumbsNav from "../layout/BreadcrumbsNav";
import UserMenu from "../users/UserMenu";

interface NavbarProps {
  handleDrawerToggle: () => void;
  isDrawerOpen: boolean;
  drawerWidth: number;
}

const Navbar: React.FC<NavbarProps> = ({
  handleDrawerToggle,
  isDrawerOpen,
  drawerWidth = 240,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: theme.shadows[1],
        zIndex: theme.zIndex.drawer - 1,
        width: isMobile
          ? "100%"
          : `calc(100% - ${isDrawerOpen ? drawerWidth : 44}px - 20px)`,
        ml: isMobile ? 0 : `${isDrawerOpen ? drawerWidth : 44}px - 20px`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <BreadcrumbsNav isMobile={isMobile} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
