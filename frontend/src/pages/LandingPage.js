import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to GreenPath Bookings
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your gateway to sustainable, eco-friendly travel experiences. Discover tours designed to respect and protect our planet while creating unforgettable memories.
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          Choose from a wide range of eco-conscious travel adventures, from mountain hikes to cultural explorations. Book your next tour with confidence and contribute to a greener future.
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </Stack>
      </Box>
      <Box textAlign="center" mt={10} sx={{ borderTop: '1px solid #ddd', pt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} GreenPath Bookings. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default LandingPage;
