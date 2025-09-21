import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  People,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PayPalCheckout from '../components/PayPalCheckout';
import { toursAPI, bookingAPI } from '../services/api';

const Tours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
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
    } catch (error) {
      console.error('Error fetching tours:', error);
      showSnackbar('Failed to load tours', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleBookTour = (tour) => {
    setSelectedTour(tour);
    setNumberOfPeople(1);
    setBookingDialog(true);
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
      showSnackbar('Booking created successfully! Payment confirmed.');
      handleCloseBookingDialog();
      // Refresh tours to update availability
      fetchTours();
    } catch (error) {
      console.error('Error creating booking:', error);
      const message = error.response?.data?.error || 'Failed to create booking';
      showSnackbar(message, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    showSnackbar('Payment failed. Please try again.', 'error');
  };

  const handlePaymentCancel = () => {
    showSnackbar('Payment was cancelled.', 'info');
  };

  const calculateTotalPrice = () => {
    if (!selectedTour || !numberOfPeople) return 0;
    return selectedTour.price * numberOfPeople;
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
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
          <Typography variant="h6" color="text.secondary">
            Discover sustainable travel experiences
          </Typography>
        </Box>

        {tours.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No tours available at the moment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back later for new eco-friendly travel options!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {tours.map((tour) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tour.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {tour.imageUrl && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={tour.imageUrl}
                      alt={tour.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
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

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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
                        color={tour.availableSpots > 0 ? 'success' : 'error'}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleBookTour(tour)}
                      disabled={tour.availableSpots === 0}
                    >
                      {tour.availableSpots === 0 ? 'Fully Booked' : 'Book Now'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Booking Dialog */}
        <Dialog open={bookingDialog} onClose={handleCloseBookingDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Book Tour: {selectedTour?.title}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {selectedTour && (
                <>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Tour Details:</strong><br />
                    Destination: {selectedTour.destination}<br />
                    Duration: {selectedTour.duration} days<br />
                    Price per person: ${selectedTour.price}<br />
                    Available spots: {selectedTour.availableSpots}
                  </Alert>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Number of People</InputLabel>
                    <Select
                      value={numberOfPeople}
                      label="Number of People"
                      onChange={(e) => setNumberOfPeople(e.target.value)}
                    >
                      {Array.from({ length: Math.min(selectedTour.availableSpots, 10) }, (_, i) => i + 1).map((num) => (
                        <MenuItem key={num} value={num}>
                          {num} {num === 1 ? 'person' : 'people'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Booking Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Price per person:</Typography>
                      <Typography>${selectedTour.price}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Number of people:</Typography>
                      <Typography>{numberOfPeople}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <DialogActions sx={{ flexDirection: 'column', gap: 2, p: 3 }}>
            <PayPalCheckout
              amount={calculateTotalPrice()}
              currency="USD"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
              disabled={!numberOfPeople || bookingLoading}
              tourTitle={selectedTour?.title || ''}
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default Tours;