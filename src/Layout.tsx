import React, { useEffect, useState } from "react";
import { Box, CssBaseline, useTheme } from "@mui/material";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { adminSocketService } from "./service/socketService";

const DRAWER_WIDTH = 260;
const NAVBAR_HEIGHT = 64;

const Layout: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDrawerOpen, _] = useState(true);
  useEffect(() => {
    adminSocketService.connect();

    const handleNewActivity = (payload: any) => {
      console.log("Real-time activity received:", payload.activity);
    };
    adminSocketService.on("activity:new", handleNewActivity);

    const handleUserUpdate = (payload: any) => {
      console.log(`Online users count: ${payload.onlineCount}`);
    };
    adminSocketService.on("user:online", handleUserUpdate);
    adminSocketService.on("user:offline", handleUserUpdate);

    return () => {
      adminSocketService.off("activity:new", handleNewActivity);
      adminSocketService.off("user:online", handleUserUpdate);
      adminSocketService.off("user:offline", handleUserUpdate);

      adminSocketService.disconnect();
    };
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />

      <CssBaseline />
      <Navbar
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        isDrawerOpen={sidebarOpen}
        drawerWidth={DRAWER_WIDTH}
      />
      <Sidebar
        drawerWidth={280}
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
        isOpen={isDrawerOpen}
        onToggleCollapse={() => {
          setSidebarOpen(!sidebarOpen);
        }}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: {
            xs: 0,
          },
          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minWidth: 0,
        }}
      >
        <Box sx={{ height: NAVBAR_HEIGHT, flexShrink: 0 }} />

        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto", // Cho phép scroll
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
