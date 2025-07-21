"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to send reset email");
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f9fafb" }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%", borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2} align="center">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} align="center">
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        {submitted ? (
          <Alert severity="success">If an account exists for this email, a reset link has been sent.</Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              autoFocus
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
}
