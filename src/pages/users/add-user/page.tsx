import React, { useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import { JSEncrypt } from "jsencrypt";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  AddCircle,
  RemoveCircle,
  VpnKey,
  ContentCopy,
  Download,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { CareerItem, FormValues } from "../../../type/types";
import { addUser } from "../../../service/update";

const AddUserPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [privateKeyForUser, setPrivateKeyForUser] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .max(50, "Username cannot exceed 50 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Password confirmation is required"),
    role: Yup.string()
      .oneOf(["user", "manager", "admin"], "Invalid role")
      .required("Role is required"),
    balance: Yup.number()
      .min(0, "Balance cannot be negative")
      .required("Initial balance is required"),
    public_key: Yup.string().required("Public Key must be generated"),
    career: Yup.array()
      .of(
        Yup.object().shape({
          institution: Yup.string().required("Institution name is required"),
          position: Yup.string().required("Position is required"),
          start_year: Yup.number()
            .typeError("Year must be a number")
            .required("Start year is required")
            .min(1900, "Invalid year")
            .max(new Date().getFullYear(), "Year cannot be in the future"),
          end_year: Yup.number()
            .typeError("Year must be a number")
            .required("End year is required")
            .min(
              Yup.ref("start_year"),
              "End year must be after or the same as the start year"
            ),
        })
      )
      .min(1, "At least one work experience is required")
      .required("Work experience is required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      balance: 0,
      public_key: "",
      career: [{ institution: "", position: "", start_year: "", end_year: "" }], // Start with one empty experience
      submit: null,
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (
      values,
      { setErrors, setStatus, setSubmitting, resetForm }
    ) => {
      try {
        const payload = {
          ...values,
          career: values.career.map((c) => ({
            ...c,
            start_year: c.start_year,
            end_year: c.end_year,
          })),
        };
        await addUser(
          payload.name,
          payload.password,
          payload.email,
          payload.public_key,
          payload.role,
          payload.balance,
          payload.career as CareerItem[]
        );

        toast.success("Create new user successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setStatus({ success: true });
        setSubmitting(false);
        resetForm();
        setPrivateKeyForUser("");
        setFeedback(null);
      } catch (error: any) {
        console.error(error);
        const message = error.message || "An unexpected error occurred.";
        toast.error("Something went wrong!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setStatus({ success: false });
        setErrors({ submit: message });
        setSubmitting(false);
      }
    },
  });

  const handleGenerateKeyPair = () => {
    setIsGeneratingKeys(true);
    setFeedback(null);
    setPrivateKeyForUser("");

    setTimeout(() => {
      try {
        const encrypt = new JSEncrypt({ default_key_size: "1024" });
        const publicKey = encrypt.getPublicKey();
        const privateKey = encrypt.getPrivateKey();

        if (!publicKey || !privateKey) {
          throw new Error("JSEncrypt failed to generate keys.");
        }

        formik.setFieldValue("public_key", publicKey, true);
        setPrivateKeyForUser(privateKey);

        setFeedback({
          type: "success",
          message:
            "Key pair generated successfully! Please SAVE your Private Key in a secure place. It cannot be recovered.",
        });
      } catch (error: any) {
        setFeedback({
          type: "error",
          message: `Key generation failed: ${error.message || "Unknown error"}`,
        });
        formik.setFieldValue("public_key", "", true);
      } finally {
        setIsGeneratingKeys(false);
      }
    }, 100);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(privateKeyForUser);
  };

  const handleDownloadKey = () => {
    const blob = new Blob([privateKeyForUser], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formik.values.email || "user"}_private_key.pem`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Paper sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Add New User
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {formik.errors.submit && (
                <Grid item xs={12}>
                  <Alert severity="error">{formik.errors.submit}</Alert>
                </Grid>
              )}
              {formik.status?.success && (
                <Grid item xs={12}>
                  <Alert severity="success">User created successfully!</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h6">Basic Information</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  size="small"
                  {...formik.getFieldProps("name")}
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  size="small"
                  {...formik.getFieldProps("email")}
                  error={formik.touched.email && !!formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  size="small"
                  {...formik.getFieldProps("password")}
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  size="small"
                  {...formik.getFieldProps("confirmPassword")}
                  error={
                    formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="overline">System & Security</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  size="small"
                  error={formik.touched.role && !!formik.errors.role}
                >
                  <InputLabel>Role</InputLabel>
                  <Select label="Role" {...formik.getFieldProps("role")}>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <Typography
                      variant="caption"
                      color="error.main"
                      sx={{ pl: 2, pt: 0.5 }}
                    >
                      {formik.errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Initial Balance"
                  type="number"
                  size="small"
                  {...formik.getFieldProps("balance")}
                  error={formik.touched.balance && !!formik.errors.balance}
                  helperText={formik.touched.balance && formik.errors.balance}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={
                    isGeneratingKeys ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <VpnKey />
                    )
                  }
                  onClick={handleGenerateKeyPair}
                  disabled={isGeneratingKeys}
                >
                  Generate RSA Key Pair
                </Button>
              </Grid>

              {feedback && (
                <Grid item xs={12}>
                  <Alert severity={feedback.type}>{feedback.message}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Public Key (Auto-generated)"
                  size="small"
                  {...formik.getFieldProps("public_key")}
                  error={
                    formik.touched.public_key && !!formik.errors.public_key
                  }
                  helperText={
                    formik.touched.public_key && formik.errors.public_key
                  }
                  required
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              {privateKeyForUser && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Private Key (Save securely!)"
                    size="small"
                    value={privateKeyForUser}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box display="flex" flexDirection="column">
                            <Tooltip title="Copy">
                              <IconButton onClick={handleCopyToClipboard}>
                                <ContentCopy />
                              </IconButton>
                            </Tooltip>
                            {/* Dòng đã được sửa */}
                            <Tooltip title="Download">
                              <IconButton onClick={handleDownloadKey}>
                                <Download />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="overline">Work Experience</Typography>
                </Divider>
              </Grid>
              {typeof formik.errors.career === "string" && (
                <Grid item xs={12}>
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {formik.errors.career}
                  </Alert>
                </Grid>
              )}
              <FieldArray name="career">
                {({ push, remove }) => (
                  <Grid item xs={12}>
                    {formik.values.career.map((_, index) => {
                      // (*** SỬA LỖI Ở ĐÂY ***)
                      // Lấy lỗi và trạng thái touched một cách an toàn
                      const careerErrors = Array.isArray(formik.errors.career)
                        ? formik.errors.career[index]
                        : undefined;
                      const careerTouched = Array.isArray(formik.touched.career)
                        ? formik.touched.career[index]
                        : undefined;

                      // Ép kiểu `careerErrors` để TypeScript hiểu nó là một object hoặc undefined
                      const itemErrors =
                        typeof careerErrors === "object"
                          ? careerErrors
                          : undefined;

                      return (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{ p: 2, mb: 2, position: "relative" }}
                        >
                          <Tooltip
                            title={
                              formik.values.career.length <= 1
                                ? "At least one experience is required"
                                : "Remove Experience"
                            }
                          >
                            <span>
                              <IconButton
                                onClick={() => remove(index)}
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                disabled={formik.values.career.length <= 1}
                              >
                                <RemoveCircle
                                  color={
                                    formik.values.career.length <= 1
                                      ? "disabled"
                                      : "error"
                                  }
                                />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label={`Institution #${index + 1}`}
                                size="small"
                                {...formik.getFieldProps(
                                  `career.${index}.institution`
                                )}
                                error={
                                  careerTouched?.institution &&
                                  !!itemErrors?.institution
                                }
                                helperText={
                                  careerTouched?.institution &&
                                  itemErrors?.institution
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Position"
                                size="small"
                                {...formik.getFieldProps(
                                  `career.${index}.position`
                                )}
                                error={
                                  careerTouched?.position &&
                                  !!itemErrors?.position
                                }
                                helperText={
                                  careerTouched?.position &&
                                  itemErrors?.position
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Start Year"
                                type="number"
                                size="small"
                                {...formik.getFieldProps(
                                  `career.${index}.start_year`
                                )}
                                error={
                                  careerTouched?.start_year &&
                                  !!itemErrors?.start_year
                                }
                                helperText={
                                  careerTouched?.start_year &&
                                  itemErrors?.start_year
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="End Year"
                                type="number"
                                size="small"
                                {...formik.getFieldProps(
                                  `career.${index}.end_year`
                                )}
                                error={
                                  careerTouched?.end_year &&
                                  !!itemErrors?.end_year
                                }
                                helperText={
                                  careerTouched?.end_year &&
                                  itemErrors?.end_year
                                }
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      );
                    })}
                    <Button
                      startIcon={<AddCircle />}
                      onClick={() =>
                        push({
                          institution: "",
                          position: "",
                          start_year: "",
                          end_year: "",
                        })
                      }
                    >
                      Add Experience
                    </Button>
                  </Grid>
                )}
              </FieldArray>

              <Box
                sx={{
                  mt: 3,
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting || !formik.values.public_key}
                  sx={{ position: "relative" }}
                >
                  Create User
                  {formik.isSubmitting && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        mt: "-12px",
                        ml: "-12px",
                      }}
                    />
                  )}
                </Button>
              </Box>
            </Grid>
          </Paper>
        </form>
      </FormikProvider>
    </Container>
  );
};

export default AddUserPage;
