import React, { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
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
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import {
  FlightTakeoffOutlined,
  LocationOnOutlined,
  StarOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import EnergySavingsLeafTwoToneIcon from "@mui/icons-material/EnergySavingsLeafTwoTone";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      if (result.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
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
        flexDirection: { xs: "column", lg: "row" }, // Responsive direction
      }}
    >
      {/* Left section - Company Information */}
      <Box
        sx={{
          flex: { xs: "1 1 auto", lg: "0 0 55%" }, // Takes more space on large screens
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          background: "rgba(46, 125, 50, 0.05)",
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
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" }, // Responsive font size
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
              Discover Sustainable Adventures
            </Typography>

            <Typography
              variant="h6"
              paragraph
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.1rem" }, // Responsive font size
              }}
            >
              Experience the world's most breathtaking destinations while
              preserving our planet. We specialize in eco-friendly tours that
              support local communities.
            </Typography>
          </Box>

          {/* Stats and features row */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch" // Use stretch to make cards same height
          >
            {/* CORRECTED: Use 'item' prop with responsive breakpoints */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(46, 125, 50, 0.2)",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <CardContent>
                  <FlightTakeoffOutlined
                    sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.dark" }}
                  >
                    500+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eco Tours Available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                elevation={0}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid rgba(46, 125, 50, 0.2)",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <CardContent>
                  <LocationOnOutlined
                    sx={{ color: "primary.main", fontSize: 32, mb: 1 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.dark" }}
                  >
                    50+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Global Destinations
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Chip
                icon={<StarOutlined />}
                label="Carbon Neutral"
                color="primary"
                variant="filled"
                sx={{ fontWeight: 500, width: "fit-content" }}
              />
              <Chip
                icon={<EnergySavingsLeafTwoToneIcon />}
                label="Sustainable Travel"
                color="primary"
                variant="filled"
                sx={{ fontWeight: 500, width: "fit-content" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Right section - Login Form */}
      <Box
        sx={{
          flex: { xs: "1 1 auto", lg: "1 1 45%" }, // Takes less space
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(46, 125, 50, 0.05)",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={12}
            sx={{
              padding: { xs: 3, sm: 4 },
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
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue your journey
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </IconButton>
                    ),
                  },
                }}
              />
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
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Box textAlign="center">
                <Link
                  component={RouterLink}
                  to="/register"
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
                  Don't have an account? Sign up
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
