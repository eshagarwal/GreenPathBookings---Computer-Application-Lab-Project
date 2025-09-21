import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  Cancel,
  Edit,
  Delete,
  LocationOn,
  Schedule,
  People,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { bookingAPI } from '../services/api';

const MyBookings = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingAPI.getAllBookings();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showSnackbar('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialog(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.deleteBooking(bookingId);
      showSnackbar('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const message = error.response?.data?.error || 'Failed to cancel booking';
      showSnackbar(message, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const canCancelBooking = (booking) => {
    // Can cancel if pending and tour hasn't started yet
    return booking.status === 'PENDING' && new Date(booking.tour?.startDate) > new Date();
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
            My Bookings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            View and manage your travel bookings
          </Typography>
        </Box>

        {bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You haven't made any bookings yet. Start exploring our tours!
            </Typography>
            <Button variant="contained" href="/tours">
              Browse Tours
            </Button>
          </Box>
        ) : (
          <>
            {isMobile ? (
              // Mobile view - Card layout
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid size={{ xs: 12 }} key={booking.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="h3">
                            {booking.tour?.title || 'Tour Unavailable'}
                          </Typography>
                          <Chip
                            label={getStatusText(booking.status)}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.tour?.destination || 'N/A'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <People sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoney sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Total: ${booking.totalPrice}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Booked: {new Date(booking.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(booking)}
                          >
                            Details
                          </Button>
                          {canCancelBooking(booking) && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // Desktop view - Table layout
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tour</TableCell>
                      <TableCell>Destination</TableCell>
                      <TableCell>People</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Booking Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.tour?.title || 'Tour Unavailable'}
                          </Typography>
                        </TableCell>
                        <TableCell>{booking.tour?.destination || 'N/A'}</TableCell>
                        <TableCell>{booking.numberOfPeople}</TableCell>
                        <TableCell>${booking.totalPrice}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(booking.status)}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            {canCancelBooking(booking) && (
                              <Tooltip title="Cancel Booking">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Booking Details Dialog */}
        <Dialog open={detailsDialog} onClose={handleCloseDetails} maxWidth="md" fullWidth>
          <DialogTitle>
            Booking Details
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Tour Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        {selectedBooking.tour?.title || 'Tour Unavailable'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {selectedBooking.tour?.description || 'No description available'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {selectedBooking.tour?.destination || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {selectedBooking.tour?.duration || 'N/A'} days
                        </Typography>
                      </Box>
                      
                      {selectedBooking.tour?.startDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2">
                            {new Date(selectedBooking.tour.startDate).toLocaleDateString()} - {new Date(selectedBooking.tour.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Booking Details
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Booking ID:</Typography>
                        <Typography fontWeight="medium">#{selectedBooking.id}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Status:</Typography>
                        <Chip
                          label={getStatusText(selectedBooking.status)}
                          color={getStatusColor(selectedBooking.status)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Number of People:</Typography>
                        <Typography fontWeight="medium">{selectedBooking.numberOfPeople}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Price per Person:</Typography>
                        <Typography fontWeight="medium">${selectedBooking.tour?.price || 0}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">Total Amount:</Typography>
                        <Typography variant="h6" color="primary">
                          ${selectedBooking.totalPrice}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Booking Date:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(selectedBooking.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
            {selectedBooking && canCancelBooking(selectedBooking) && (
              <Button 
                color="error" 
                variant="outlined"
                onClick={() => {
                  handleCancelBooking(selectedBooking.id);
                  handleCloseDetails();
                }}
              >
                Cancel Booking
              </Button>
            )}
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

export default MyBookings;