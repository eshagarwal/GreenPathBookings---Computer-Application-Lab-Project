import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TourDetails = () => {
  const { id } = useParams(); // Get tour ID from URL
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tour details');
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mt: 4, display: 'block', mx: 'auto' }} />;

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );

  if (!tour) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &lt; Back to tours
      </Button>
      <Card>
        {tour.images && tour.images.length > 0 && (
          <CardMedia component="img" height="400" image={tour.images[0]} alt={tour.title} />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {tour.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Location: {tour.location}
          </Typography>
          <Typography variant="body1" paragraph>
            {tour.description}
          </Typography>
          <Typography variant="h6">Price: ${tour.price}</Typography>
          {/* Add any extra fields here like environmentalRating, dates */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            // Placeholder for booking action
            onClick={() => alert('Booking feature to be implemented')}
          >
            Book This Tour
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TourDetails;
