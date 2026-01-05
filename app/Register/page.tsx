"use client";
import React, { useState } from "react";
import {
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
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";

/* ===== Theme (UNCHANGED) ===== */
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2866f2",
      light: "#6699ff",
      dark: "#1741a6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f5f7ff",
    },
    background: {
      default: "#0f111a",
      paper: "#1f2433",
    },
    text: {
      primary: "#f5f7ff",
      secondary: "#a0a4b7",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h5: {
      fontWeight: 700,
      color: "#2866f2",
    },
    subtitle1: {
      color: "#a0a4b7",
    },
    body2: {
      color: "#a0a4b7",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#3a415a" },
            "&:hover fieldset": { borderColor: "#2866f2" },
            "&.Mui-focused fieldset": { borderColor: "#2866f2" },
          },
          "& .MuiInputLabel-root": {
            color: "#a0a4b7",
            "&.Mui-focused": { color: "#2866f2" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 8,
          backgroundColor: "#2866f2",
          "&:hover": { backgroundColor: "#1741a6" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1f2433",
          borderRadius: 18,
        },
      },
    },
  },
});

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log({ email, username, password });
    alert("Register successful (demo)");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f111a 60%, #2866f2 100%)",
          p: 2,
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            maxWidth: 420,
            width: "100%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => router.push("/")}
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>

          <Box textAlign="center" mb={3}>
            <LockOutlinedIcon sx={{ fontSize: 44, color: "primary.main" }} />
            <Typography variant="h5" mt={1}>
              Create Account
            </Typography>
            <Typography variant="subtitle1">
              Register to get started
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
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
              label="Username"
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              required
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
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box textAlign="right" mt={1}>
              <Link href="/ForgotPassword" underline="hover">
                Forgot password?
              </Link>
            </Box>

            <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
              Register
            </Button>
          </form>

          <Typography variant="body2" align="center" mt={2}>
            Already have an account?{" "}
            <Link href="/Login" underline="hover">
              Login
            </Link>
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
