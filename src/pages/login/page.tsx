import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  Divider,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AdminPanelSettings,
  Login as LoginIcon,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";

type FormData = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleInputChange =
    (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
      if (error) setError("");
    };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter all required fields.");
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Login failed. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box>
                <AdminPanelSettings />
              </Box>

              <Typography variant="h4" component="h1">
                Admin Portal
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Sign in to access the admin dashboard
              </Typography>

              <Chip label="Secure Login" size="small" />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                placeholder="admin@example.com"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange("password")}
                required
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                textAlign: "center",
                display: "block",
                opacity: 0.8,
              }}
            >
              © 2024 Admin Dashboard. All rights reserved.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;
