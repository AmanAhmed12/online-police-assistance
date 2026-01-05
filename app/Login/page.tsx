// LoginPage.js (or .tsx)
"use client";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation"; // Assuming Next.js for navigation

// Define your custom dark blue and white theme for Material-UI
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enable dark mode features (e.g., default text/background)
    primary: {
      main: "#2866f2", // Your main dark blue
      light: "#6699ff",
      dark: "#1741a6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f5f7ff", // Your main white/off-white
      light: "#ffffff",
      dark: "#cccccc",
      contrastText: "#000000",
    },
    error: { // Good to define for form validation
      main: '#ef5350',
    },
    background: {
      default: "#0f111a", // Deep dark blue for the overall page background
      paper: "#1f2433", // Slightly lighter dark blue for card/paper backgrounds
    },
    text: {
      primary: "#f5f7ff", // White text for primary content
      secondary: "#a0a4b7", // Lighter grey for secondary text (e.g., labels, hints)
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Or your preferred font (e.g., 'Inter', 'sans-serif')
    h5: {
      fontWeight: 700,
      color: "#2866f2", // Specific color for "Welcome Back"
    },
    subtitle1: {
      color: "#a0a4b7", // Color for "Sign in to your account"
    },
    body2: {
      color: "#a0a4b7", // Color for "Don't have an account?"
    },
  },
  components: {
    // Global overrides for Material-UI components
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#3a415a",
            },
            "&:hover fieldset": {
              borderColor: "#2866f2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2866f2",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#a0a4b7",
            "&.Mui-focused": {
                color: "#2866f2",
            }
          },
          "& .MuiInputBase-input": {
            color: "#f5f7ff",
          },
          "& .MuiInputAdornment-root": {
            color: "#a0a4b7",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(40,102,242,0.12)",
          transition: "background 0.2s",
          backgroundColor: "#2866f2",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#1741a6",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1f2433",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(40,102,242,0.15)",
        },
      },
    },
    MuiLink: {
        styleOverrides: {
            root: {
                color: '#2866f2',
                textDecoration: 'underline',
                fontWeight: 600,
                "&:hover": {
                    color: '#6699ff',
                }
            }
        }
    }
  },
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Initialize useRouter for navigation

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    console.log("Email:", email);
    console.log("Password:", password);
    alert('Login attempt with: ' + email + ' and ' + password); // Simple alert for demonstration
  };

  const handleGoBack = () => {
    // router.back(); // Navigates back to the previous page
    router.push("/")
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Applies global CSS resets and theme-based background */}
      
      {/* The main container that centers its content */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f111a 60%, #2866f2 100%)',
          padding: { xs: 2, sm: 3 } // Responsive padding with MUI sx
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: { xs: '24px 8px', sm: '40px 32px' },
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleGoBack}
            aria-label="go back"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: 'secondary.main',
              '&:hover': {
                color: 'primary.light',
              }
            }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <LockOutlinedIcon
              sx={{
                fontSize: '2.8rem',
                color: 'primary.main',
                marginBottom: '8px',
              }}
            />
            <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sign in to your account
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </form>
          <Typography variant="body2" align="center" color="textSecondary">
            Don't have an account?{" "}
            <a href="/Register"
              style={{
                color: darkTheme.palette.primary.main,
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              Register
            </a>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}