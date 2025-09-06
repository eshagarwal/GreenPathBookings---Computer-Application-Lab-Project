import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking state
  const [participants, setParticipants] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await api.get(`/tours/${id}`);
        setTour(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tour details");
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBooking = async () => {
    setBookingError("");
    setBookingSuccess("");
    // Assume JWT token is stored in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setBookingError("You need to be logged in to book a tour.");
      return;
    }

    try {
      const response = await api.post(
        "/bookings",
        {
          tourId: id,
          numberOfSpots: participants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookingSuccess("Booking successful! Thank you for your reservation.");
    } catch (err) {
      setBookingError(err.response?.data?.msg || "Booking failed");
    }
  };

  if (loading)
    return <CircularProgress sx={{ mt: 4, display: "block", mx: "auto" }} />;

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
          <CardMedia
            component="img"
            height="400"
            image={tour.images[0]}
            alt={tour.title}
          />
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

          <Typography variant="h6" gutterBottom>
            Price: ${tour.price}
          </Typography>

          {/* Add these sustainability and itinerary sections here */}

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Sustainability Commitment
          </Typography>
          <Typography variant="body1" paragraph>
            This tour operates with a commitment to minimizing environmental
            impact. We use solar-powered accommodations, support local
            communities, and offset carbon emissions for all travel.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Itinerary Highlights
          </Typography>
          <ul>
            {tour.itinerary?.map((day, idx) => (
              <li key={idx}>
                <Typography variant="body2">{day}</Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Traveler Guidelines
          </Typography>
          <Typography variant="body2" paragraph>
            Please bring reusable water bottles and avoid single-use plastics.
            Respect the local environment and wildlife by following guide
            instructions carefully.
          </Typography>

          {bookingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {bookingError}
            </Alert>
          )}
          {bookingSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {bookingSuccess}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate(`/book/${tour._id}`)}
          >
            Book This Tour
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TourDetails;
