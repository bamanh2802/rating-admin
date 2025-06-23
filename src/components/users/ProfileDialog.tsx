// src/components/profile/ProfileDialog.tsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, AccountCircle } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose }) => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIsEditing(false); // Luôn bắt đầu ở chế độ xem
    }
  }, [user, open]);

  const handleSave = () => {
    console.log("Saving new name:", name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
    }
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Hồ sơ cá nhân
        </Typography>
        <IconButton aria-label="close" onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {user ? (
          <Grid container spacing={3} alignItems="center" sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4} textAlign="center">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  m: "auto",
                  fontSize: "3rem",
                  bgcolor: "primary.main",
                }}
              >
                {user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <AccountCircle />
                )}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                margin="normal"
                label="Tên hiển thị"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={user.email}
                disabled
                variant="outlined"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Vai trò"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                disabled
                variant="outlined"
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: "16px 24px" }}>
        {isEditing ? (
          <>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button variant="contained" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCloseDialog}>Đóng</Button>
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
