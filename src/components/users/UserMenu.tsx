// src/components/layout/UserMenu.tsx

import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { Logout, AccountCircle, Brightness4 } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import ProfileDialog from "./ProfileDialog";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  const handleProfileClick = () => {
    setProfileDialogOpen(true);
    handleUserMenuClose();
  };

  return (
    <>
      {" "}
      {/* Sử dụng Fragment để bọc cả IconButton và Dialog */}
      <Box>
        <Tooltip title="Account">
          <IconButton onClick={handleUserMenuOpen} size="small">
            <Avatar
              src=""
              alt={user?.name || "User"}
              sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
            >
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <AccountCircle />
              )}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          id="user-menu"
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleUserMenuClose}
          // ... các props khác của Menu giữ nguyên ...
        >
          {/* ... Box thông tin user giữ nguyên ... */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Avatar
              src=""
              alt={user?.name || "User"}
              sx={{ width: 40, height: 40, mr: 1.5, bgcolor: "primary.main" }}
            >
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <AccountCircle />
              )}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="subtitle2" fontWeight="bold">
                {user?.name || "User name"}
              </Typography>
              <Typography noWrap variant="body2" color="text.secondary">
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          </Box>
          <Divider />

          {/* (THAY ĐỔI Ở ĐÂY) */}
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <Brightness4 fontSize="small" />
            </ListItemIcon>
            <ListItemText>Theme Change</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ color: "error.main", fontWeight: 500 }}
            >
              Logout
            </ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      {/* Render Dialog, chỉ hiển thị khi isProfileDialogOpen là true */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  );
};

export default UserMenu;
