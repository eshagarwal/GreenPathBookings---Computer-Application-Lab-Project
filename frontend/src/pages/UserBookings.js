import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view bookings.');
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setSuccess('Booking cancelled successfully.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to cancel booking');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {!loading && !error && bookings.length === 0 && (
        <Typography>No bookings found.</Typography>
      )}

      {!loading && bookings.length > 0 && (
        <List>
          {bookings.map((booking) => (
            <ListItem
              key={booking._id}
              divider
              button
              onClick={() => navigate(`/tours/${booking.tour._id}`)}
            >
              <ListItemText
                primary={booking.tour.title}
                secondary={`Date: ${new Date(booking.tour.startDate).toLocaleDateString()} - Participants: ${booking.participants}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="cancel"
                  onClick={() => handleCancel(booking._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default UserBookings;
