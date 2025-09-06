import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import api from "../services/api"; // Your API service

const steps = [
  "Personal Info",
  "Booking Details",
  "Payment",
  "Review & Confirm",
];

const BookingForm = () => {
  const { tourId } = useParams(); // Access tourId from URL param
  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [errorTour, setErrorTour] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    participants: 1,
    startDate: "",
    endDate: "",
    specialRequests: "",
    paymentMethod: "",
  });
  const [error, setError] = useState("");

  // Fetch tour details by tourId on component mount
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/${tourId}`);
        setTour(response.data);
      } catch (err) {
        setErrorTour("Failed to load tour details.");
      } finally {
        setLoadingTour(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleNext = () => {
    // Basic validation example per step
    if (activeStep === 0) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError("Please complete all required personal info fields.");
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.participants || !formData.startDate || !formData.endDate) {
        setError("Please complete all booking details.");
        return;
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError("End date cannot be before start date.");
        return;
      }
    }
    if (activeStep === 2) {
      if (!formData.paymentMethod) {
        setError("Please select a payment method.");
        return;
      }
    }
    setError("");
    if (activeStep === steps.length - 1) {
      // Final submission logic here (call backend booking API)
      console.log("Booking data submitted:", formData);
      alert("Booking submitted successfully! Implementation pending.");
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSubmit = async (formData) => {
    try {
      // Replace with real booking API call, e.g.:
      // await api.post('/api/bookings', formData, { headers: { Authorization: `Bearer ${token}` } });

      console.log("Submitting booking", formData);

      // Show success snackbar
      setSnackbar({
        open: true,
        severity: "success",
        message: "Booking confirmed!",
      });

      // Redirect after delay (2 seconds here)
      setTimeout(() => {
        navigate("/api/bookings"); // or another path like /bookings
      }, 2000);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        severity: "error",
        message:
          error.response?.data?.msg || "Booking failed, please try again.",
      });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (loadingTour) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorTour) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{errorTour}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Book Tour: {tour?.title || "Loading..."}
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange("phone")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </Box>
      )}

      {activeStep === 1 && (
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Number of Participants"
            type="number"
            inputProps={{ min: 1 }}
            value={formData.participants}
            onChange={handleChange("participants")}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange("startDate")}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange("endDate")}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange("specialRequests")}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      )}

      {activeStep === 2 && (
        <Box component="form" noValidate autoComplete="off">
          {/* Payment method selection */}
          <TextField
            label="Payment Method"
            select
            SelectProps={{ native: true }}
            value={formData.paymentMethod}
            onChange={handleChange("paymentMethod")}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            <option value="">Select payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </TextField>

          {/* Placeholder for payment integration - you would integrate Stripe or other API here */}
          <Typography variant="body2" color="text.secondary">
            Payment integration will be handled after selecting a method.
          </Typography>
        </Box>
      )}

      {activeStep === 3 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Please review your booking details:
          </Typography>
          <Typography>
            <strong>Name:</strong> {formData.fullName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {formData.phone}
          </Typography>
          <Typography>
            <strong>Travel Dates:</strong> {formData.startDate} to{" "}
            {formData.endDate}
          </Typography>
          <Typography>
            <strong>Participants:</strong> {formData.participants}
          </Typography>
          <Typography>
            <strong>Special Requests:</strong>{" "}
            {formData.specialRequests || "None"}
          </Typography>
          <Typography>
            <strong>Payment Method:</strong> {formData.paymentMethod}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => handleSubmit(formData)}
          >
            Confirm and Book
          </Button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingForm;
