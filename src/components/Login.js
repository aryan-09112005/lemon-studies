import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openForgot, setOpenForgot] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleForgotPassword = () => {
    alert(`A password reset link would be sent to ${email}`);
    setOpenForgot(false);
    setEmail("");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Admin Login
      </Typography>
      <TextField
        label="Username"
        fullWidth
        sx={{ mb: 2 }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        sx={{ mb: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleLogin}>
        Login
      </Button>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", color: "blue", cursor: "pointer" }}
        onClick={() => setOpenForgot(true)}
      >
        Forgot Password?
      </Typography>

      {/* Forgot Password Dialog */}
      <Dialog open={openForgot} onClose={() => setOpenForgot(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgot(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} variant="contained">
            Send Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
