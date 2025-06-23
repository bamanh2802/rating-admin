import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5c1769",
      light: "#8e4ec6",
      dark: "#3d0e47",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#667eea",
      light: "#9bb5ff",
      dark: "#3f51b5",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#ffcdd2",
      dark: "#d32f2f",
    },
    warning: {
      main: "#ff9800",
      light: "#ffe0b2",
      dark: "#f57c00",
    },
    success: {
      main: "#4caf50",
      light: "#c8e6c9",
      dark: "#388e3c",
    },
    info: {
      main: "#2196f3",
      light: "#bbdefb",
      dark: "#1976d2",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 4px 8px rgba(0,0,0,0.08)",
    "0px 8px 16px rgba(0,0,0,0.1)",
    "0px 12px 24px rgba(0,0,0,0.12)",
    "0px 16px 32px rgba(0,0,0,0.15)",
    "0px 20px 40px rgba(0,0,0,0.18)",
    "0px 24px 48px rgba(0,0,0,0.2)",
    "0px 32px 64px rgba(0,0,0,0.25)",
    "0px 40px 80px rgba(0,0,0,0.3)",
    "0px 48px 96px rgba(0,0,0,0.35)",
    "0px 56px 112px rgba(0,0,0,0.4)",
    "0px 64px 128px rgba(0,0,0,0.45)",
    "0px 72px 144px rgba(0,0,0,0.5)",
    "0px 80px 160px rgba(0,0,0,0.55)",
    "0px 88px 176px rgba(0,0,0,0.6)",
    "0px 96px 192px rgba(0,0,0,0.65)",
    "0px 104px 208px rgba(0,0,0,0.7)",
    "0px 112px 224px rgba(0,0,0,0.75)",
    "0px 120px 240px rgba(0,0,0,0.8)",
    "0px 128px 256px rgba(0,0,0,0.85)",
    "0px 136px 272px rgba(0,0,0,0.9)",
    "0px 144px 288px rgba(0,0,0,0.95)",
    "0px 152px 304px rgba(0,0,0,1)",
    "0px 160px 320px rgba(92,23,105,0.3)",
  ],
  components: {
    // TextField Components
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#edf2f7",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#cbd5e0",
              },
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5c1769",
                borderWidth: "2px",
              },
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0",
            borderWidth: "1px",
          },
          "& .MuiInputLabel-root": {
            color: "#4a5568",
            fontWeight: 500,
            backgroundColor: "transparent",
            "&.Mui-focused": {
              color: "#5c1769",
            },
            "&.MuiInputLabel-shrink": {
              backgroundColor: "#ffffff",
              padding: "0 8px",
              marginLeft: "-4px",
            },
          },
        },
      },
    },

    // Button Components
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: "none",
    //       fontWeight: 600,
    //       borderRadius: "10px",
    //       padding: "12px 28px",
    //       fontSize: "0.95rem",
    //       boxShadow: "none",
    //       transition: "all 0.2s ease-in-out",
    //       minHeight: "44px",
    //       "&:hover": {
    //         boxShadow: "none",
    //         transform: "none",
    //       },
    //       "&:active": {
    //         transform: "scale(0.98)",
    //       },
    //       "&:focus": {
    //         outline: "2px solid rgba(92,23,105,0.2)",
    //         outlineOffset: "2px",
    //       },
    //     },
    //     contained: {
    //       backgroundColor: "#5c1769",
    //       color: "#ffffff",
    //       border: "1px solid #5c1769",
    //       "&:hover": {
    //         backgroundColor: "#4a1356",
    //         borderColor: "#4a1356",
    //       },
    //       "&:disabled": {
    //         backgroundColor: "#e2e8f0",
    //         color: "#a0aec0",
    //         borderColor: "#e2e8f0",
    //       },
    //     },
    //     outlined: {
    //       borderColor: "#5c1769",
    //       color: "#5c1769",
    //       backgroundColor: "transparent",
    //       borderWidth: "1.5px",
    //       "&:hover": {
    //         backgroundColor: "#5c1769",
    //         color: "#ffffff",
    //         borderColor: "#5c1769",
    //       },
    //       "&:disabled": {
    //         borderColor: "#e2e8f0",
    //         color: "#a0aec0",
    //       },
    //     },
    //     text: {
    //       color: "#5c1769",
    //       backgroundColor: "transparent",
    //       "&:hover": {
    //         backgroundColor: "rgba(92,23,105,0.08)",
    //       },
    //       "&:disabled": {
    //         color: "#a0aec0",
    //       },
    //     },
    //     sizeSmall: {
    //       padding: "8px 20px",
    //       fontSize: "0.875rem",
    //       minHeight: "36px",
    //     },
    //     sizeLarge: {
    //       padding: "16px 36px",
    //       fontSize: "1rem",
    //       minHeight: "52px",
    //     },
    //   },
    // },

    // Card Components
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        },
      },
    },

    // Paper Components
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.1)",
        },
        elevation1: {
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        },
        elevation2: {
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        },
        elevation3: {
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        },
      },
    },

    // Chip Components
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: 500,
          backgroundColor: "#f7fafc",
          border: "1px solid #e2e8f0",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#edf2f7",
            transform: "scale(1.05)",
          },
        },
        colorPrimary: {
          backgroundColor: "rgba(92,23,105,0.1)",
          color: "#5c1769",
          border: "1px solid rgba(92,23,105,0.2)",
        },
        colorSecondary: {
          backgroundColor: "rgba(102,126,234,0.1)",
          color: "#667eea",
          border: "1px solid rgba(102,126,234,0.2)",
        },
      },
    },

    // Alert Components
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid",
          fontWeight: 500,
        },
        standardError: {
          backgroundColor: "rgba(244,67,54,0.1)",
          borderColor: "rgba(244,67,54,0.2)",
          color: "#d32f2f",
        },
        standardWarning: {
          backgroundColor: "rgba(255,152,0,0.1)",
          borderColor: "rgba(255,152,0,0.2)",
          color: "#f57c00",
        },
        standardInfo: {
          backgroundColor: "rgba(33,150,243,0.1)",
          borderColor: "rgba(33,150,243,0.2)",
          color: "#1976d2",
        },
        standardSuccess: {
          backgroundColor: "rgba(76,175,80,0.1)",
          borderColor: "rgba(76,175,80,0.2)",
          color: "#388e3c",
        },
      },
    },

    // Dialog Components
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        },
      },
    },

    // Table Components
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e2e8f0",
          padding: "16px",
        },
        head: {
          backgroundColor: "#f7fafc",
          fontWeight: 600,
          color: "#2d3748",
          borderBottom: "2px solid #e2e8f0",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },

    // Tab Components
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          borderRadius: "8px",
          margin: "0 4px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(92,23,105,0.05)",
          },
        },
      },
    },

    // Switch Components
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        track: {
          borderRadius: 22,
          backgroundColor: "#e2e8f0",
          opacity: 1,
        },
        thumb: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          backgroundColor: "#ffffff",
        },
        switchBase: {
          "&.Mui-checked": {
            "& + .MuiSwitch-track": {
              backgroundColor: "#5c1769",
              opacity: 1,
            },
          },
        },
      },
    },

    // Checkbox Components
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          padding: "8px",
          "&:hover": {
            backgroundColor: "rgba(92,23,105,0.05)",
          },
        },
      },
    },

    // Radio Components
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: "8px",
          "&:hover": {
            backgroundColor: "rgba(92,23,105,0.05)",
          },
        },
      },
    },

    // Menu Components
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid rgba(255,255,255,0.1)",
          marginTop: "8px",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "4px 8px",
          padding: "8px 12px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(92,23,105,0.08)",
            transform: "translateX(4px)",
          },
        },
      },
    },

    // Tooltip Components
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#2d3748",
          color: "#ffffff",
          borderRadius: "8px",
          fontSize: "0.875rem",
          padding: "8px 12px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        },
        arrow: {
          color: "#2d3748",
        },
      },
    },

    // Divider Components
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e2e8f0",
          opacity: 0.6,
        },
      },
    },

    // AppBar Components
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "#2d3748",
        },
      },
    },

    // Drawer Components
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(10px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        },
      },
    },
  },
});

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
