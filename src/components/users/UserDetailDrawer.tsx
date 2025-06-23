import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  BusinessCenter,
  School,
} from "@mui/icons-material";
import { UserManager, Career } from "../../type/types";
import { SelectChangeEvent } from "@mui/material";

interface UserDetailDrawerProps {
  user: UserManager | null;
  open: boolean;
  onClose: () => void;
  // Prop onSave được cập nhật để nhận `password`
  onSave: (updatedUser: UserManager, password: string) => void;
}

const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserManager | null>(user);
  // THAY ĐỔI: State cho mật khẩu thay vì private key
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(user);
    // THAY ĐỔI: Reset mật khẩu
    setPassword("");
    setFormError(null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
      if (formError) setFormError(null);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = () => {
    if (!formData) return;

    const isBalanceChanged = formData.balance !== user?.balance;
    const isScoreChanged = formData.credit_score !== user?.credit_score;

    // THAY ĐỔI: Kiểm tra xem mật khẩu đã được nhập chưa
    if ((isBalanceChanged || isScoreChanged) && password.trim() === "") {
      setFormError(
        "Your admin password is required to modify balance or credit score."
      );
      return;
    }

    onSave(formData, password);
  };

  if (!formData) {
    return null;
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 500 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            User Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ flexGrow: 1, pr: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email || ""}
                variant="outlined"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleSelectChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Balance ($)"
                name="balance"
                type="number"
                value={formData.balance ?? 0}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled
                fullWidth
                label="Credit Score"
                name="credit_score"
                type="number"
                value={formData.credit_score ?? 0}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            {(formData.balance !== user?.balance ||
              formData.credit_score !== user?.credit_score) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Admin Password"
                  placeholder="Enter your password to confirm changes"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  variant="outlined"
                  error={!!formError}
                  helperText={formError}
                  autoComplete="current-password"
                />
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }}>
            <Chip
              label="Career & Education History"
              icon={<BusinessCenter />}
            />
          </Divider>

          <Box>
            {formData.careers?.length > 0 ? (
              formData.careers.map((career: Career) => (
                <Card key={career._id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <School sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="h6" component="div">
                        {career.institution}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary">
                      {career.position}
                    </Typography>
                    <Typography variant="body2">
                      {career.start_year} - {career.end_year || "Present"}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="text.secondary" textAlign="center">
                No work/education information available.
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserDetailDrawer;
