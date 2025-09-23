import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Link,
} from "@mui/material";
import {
  LocationOn,
  Schedule,
  People,
  AttachMoney,
  CalendarToday,
  Search,
  Clear,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import PayPalCheckout from "../components/PayPalCheckout";
import { toursAPI, bookingAPI } from "../services/api";

const Tours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTours, setFilteredTours] = useState([]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await toursAPI.getAllTours(true); // Only active tours
      setTours(data);
      setFilteredTours(data); // Initialize filtered tours
    } catch (error) {
      console.error("Error fetching tours:", error);
      showSnackbar("Failed to load tours", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter tours based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTours(tours);
    } else {
      const filtered = tours.filter((tour) => {
        const query = searchQuery.toLowerCase();
        return tour.title.toLowerCase().includes(query);
      });
      setFilteredTours(filtered);
    }
  }, [tours, searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleBookTour = (tour) => {
    setSelectedTour(tour);
    setNumberOfPeople(1);
    setBookingDialog(true);
  };

  const handleShowTourDetails = (tour) => {
    setSelectedTour(tour);
    setDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialog(false);
    setSelectedTour(null);
  };

  const handleCloseBookingDialog = () => {
    setBookingDialog(false);
    setSelectedTour(null);
    setNumberOfPeople(1);
    setPaymentData(null);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    if (!selectedTour) return;

    try {
      setBookingLoading(true);
      const bookingData = {
        tourId: selectedTour.id,
        numberOfPeople: parseInt(numberOfPeople),
        paymentData: paymentDetails,
      };

      await bookingAPI.createBooking(bookingData);
      showSnackbar("Booking created successfully! Payment confirmed.");
      handleCloseBookingDialog();
      // Refresh tours to update availability
      fetchTours();
    } catch (error) {
      console.error("Error creating booking:", error);
      const message = error.response?.data?.error || "Failed to create booking";
      showSnackbar(message, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    showSnackbar("Payment failed. Please try again.", "error");
  };

  const handlePaymentCancel = () => {
    showSnackbar("Payment was cancelled.", "info");
  };

  const calculateTotalPrice = () => {
    if (!selectedTour || !numberOfPeople) return 0;
    return selectedTour.price * numberOfPeople;
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Available Tours
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Discover sustainable travel experiences
          </Typography>

          {/* Search Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tours by destination, title, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
                endAdornment: searchQuery && (
                  <Button
                    onClick={handleClearSearch}
                    size="small"
                    sx={{ minWidth: "auto", p: 1 }}
                  >
                    <Clear sx={{ fontSize: 20 }} />
                  </Button>
                ),
              }}
              sx={{ maxWidth: 600 }}
            />
            {searchQuery && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {filteredTours.length} tour
                {filteredTours.length !== 1 ? "s" : ""} found
              </Typography>
            )}
          </Box>
        </Box>

        {tours.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No tours available at the moment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back later for new eco-friendly travel options!
            </Typography>
          </Box>
        ) : filteredTours.length === 0 && searchQuery ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No tours found for "{searchQuery}"
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Try adjusting your search terms or browse all available tours.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearSearch}
              sx={{ mt: 2 }}
            >
              Clear Search
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredTours.map((tour) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tour.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                  onClick={() => handleShowTourDetails(tour)}
                >
                  {tour.imageUrl && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={tour.imageUrl}
                      alt={tour.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h5" component="h2" gutterBottom>
                        {tour.title}
                      </Typography>
                      <Chip
                        label={`$${tour.price}`}
                        color="primary"
                        size="small"
                        icon={<AttachMoney />}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOn
                        sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {tour.destination}
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {tour.description.length > 120
                        ? `${tour.description.substring(0, 120)}...`
                        : tour.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      <Chip
                        icon={<Schedule />}
                        label={`${tour.duration} days`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<People />}
                        label={`${tour.availableSpots}/${tour.maxCapacity} spots`}
                        size="small"
                        variant="outlined"
                        color={tour.availableSpots > 0 ? "success" : "error"}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarToday
                        sx={{ mr: 1, fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(tour.startDate).toLocaleDateString()} -{" "}
                        {new Date(tour.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookTour(tour);
                      }}
                      disabled={tour.availableSpots === 0}
                    >
                      {tour.availableSpots === 0 ? "Fully Booked" : "Book Now"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Booking Dialog */}
        <Dialog
          open={bookingDialog}
          onClose={handleCloseBookingDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Book Tour: {selectedTour?.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {selectedTour && (
                <>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Tour Details:</strong>
                    <br />
                    Destination: {selectedTour.destination}
                    <br />
                    Duration: {selectedTour.duration} days
                    <br />
                    Price per person: ${selectedTour.price}
                    <br />
                    Available spots: {selectedTour.availableSpots}
                  </Alert>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Number of People</InputLabel>
                    <Select
                      value={numberOfPeople}
                      label="Number of People"
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                    >
                      {Array.from(
                        { length: Math.min(selectedTour.availableSpots, 10) },
                        (_, i) => i + 1
                      ).map((num) => (
                        <MenuItem key={num} value={num}>
                          {num} {num === 1 ? "person" : "people"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Booking Summary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Price per person:</Typography>
                      <Typography>${selectedTour.price}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Number of people:</Typography>
                      <Typography>{numberOfPeople}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        ${calculateTotalPrice()}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ flexDirection: "column", gap: 2, p: 3 }}>
            <PayPalCheckout
              amount={calculateTotalPrice()}
              currency="USD"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
              disabled={!numberOfPeople || bookingLoading}
              tourTitle={selectedTour?.title || ""}
              numberOfPeople={numberOfPeople}
            />
            <Button
              onClick={handleCloseBookingDialog}
              variant="outlined"
              fullWidth
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tour Details Dialog */}
        <Dialog
          open={detailsDialog}
          onClose={handleCloseDetailsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                {selectedTour?.title}
              </Typography>
              <Chip
                label={`$${selectedTour?.price} per person`}
                color="primary"
                icon={<AttachMoney />}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTour && (
              <Box sx={{ py: 1 }}>
                {/* Tour Image */}
                {selectedTour.imageUrl && (
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={selectedTour.imageUrl}
                      alt={selectedTour.title}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}

                {/* Basic Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tour Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Destination
                          </Typography>
                          <Typography variant="body1">
                            {selectedTour.destination}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Schedule sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography variant="body1">
                            {selectedTour.duration} days
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Tour Dates
                          </Typography>
                          <Typography variant="body1">
                            {new Date(
                              selectedTour.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              selectedTour.endDate
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <People sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Availability
                          </Typography>
                          <Typography
                            variant="body1"
                            color={
                              selectedTour.availableSpots > 0
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {selectedTour.availableSpots} of{" "}
                            {selectedTour.maxCapacity} spots available
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    About This Tour
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedTour.description}
                  </Typography>
                </Box>

                {/* Sustainability Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Eco-Friendly Features
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      label="Carbon Neutral Transportation"
                      variant="outlined"
                      color="success"
                      size="small"
                    />
                    <Chip
                      label="Local Community Support"
                      variant="outlined"
                      color="success"
                      size="small"
                    />
                    <Chip
                      label="Sustainable Accommodation"
                      variant="outlined"
                      color="success"
                      size="small"
                    />
                    <Chip
                      label="Wildlife Conservation"
                      variant="outlined"
                      color="success"
                      size="small"
                    />
                    <Chip
                      label="Zero Waste Policy"
                      variant="outlined"
                      color="success"
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Pricing Information */}
                <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Pricing
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1">Price per person:</Typography>
                    <Typography
                      variant="h5"
                      color="primary.main"
                      fontWeight="bold"
                    >
                      ${selectedTour.price}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Includes accommodation, meals, guided tours, and
                    transportation
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseDetailsDialog}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Close
            </Button>
            {selectedTour && selectedTour.availableSpots > 0 && (
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseDetailsDialog();
                  handleBookTour(selectedTour);
                }}
              >
                Book This Tour
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            action={
              <Link href="/my-bookings" color="inherit" underline="always">
                View My Bookings
              </Link>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default Tours;
