import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import {
  StarOutlined,
  CheckCircleOutlined,
  SecurityOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import EnergySavingsLeafTwoToneIcon from "@mui/icons-material/EnergySavingsLeafTwoTone";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    // Main container: Stacks vertically on small screens (xs), row on large (lg)
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
      }}
    >
      {/* Left section - Company Information */}
      <Box
        sx={{
          flex: { xs: "1 1 auto", lg: "0 0 50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          background:
            "linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(76, 175, 80, 0.05) 100%)",
          borderBottom: { xs: "1px solid rgba(46, 125, 50, 0.1)", lg: "none" },
          borderRight: { lg: "1px solid rgba(46, 125, 50, 0.1)" },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <EnergySavingsLeafTwoToneIcon
                sx={{
                  fontSize: { xs: 40, md: 50 },
                  color: "primary.main",
                  mr: 2,
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  // Responsive font size
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
                }}
              >
                GreenPath Bookings
              </Typography>
            </Box>

            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "text.primary",
                fontWeight: 500,
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "2rem" }, // Responsive font size
              }}
            >
              Join the Sustainable Travel Revolution
            </Typography>

            <Typography
              variant="h6"
              paragraph
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: "900px",
                mx: "auto",
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.1rem" }, // Responsive font size
              }}
            >
              Create your account to unlock exclusive eco-friendly tours and a
              community of conscious travelers making a positive impact.
            </Typography>
          </Box>

          {/* Features and benefits row */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            {/* CORRECTED: Use item prop with responsive breakpoints */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <CheckCircleOutlined
                  sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Carbon-neutral travel
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <SecurityOutlined
                  sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Secure booking & payment
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <SupportAgentOutlined
                  sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  24/7 customer support
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <CheckCircleOutlined
                  sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Support local communities
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Chip
              icon={<StarOutlined />}
              label="Trusted by 10,000+ travelers"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              icon={<EnergySavingsLeafTwoToneIcon />}
              label="Award-winning sustainability"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Right section - Registration Form */}
      <Box
        sx={{
          flex: { xs: "1 1 auto", lg: "1 1 50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(46, 125, 50, 0.05) 0%, rgba(76, 175, 80, 0.05) 100%)",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={12}
            sx={{
              // Responsive padding
              padding: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                component="h2"
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Start Your Journey
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create your account to discover sustainable adventures
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <Grid container spacing={2}>
                {/* CORRECTED: Grid items for form fields */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1b5e20, #388e3c)",
                  },
                }}
                disabled={loading}
                startIcon={
                  loading && <CircularProgress size={24} color="inherit" />
                }
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <Box textAlign="center">
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Already have an account? Sign in here
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;
