import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to GreenPath Bookings
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your sustainable travel booking platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* User Info Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Your Profile
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Name:</strong> {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Role:</strong> {user?.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since: {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      My Bookings
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate('/my-bookings')}
                    >
                      View All
                    </Button>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <EnergySavingsLeafIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Eco Tours
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate('/tours')}
                    >
                      Explore
                    </Button>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ textAlign: 'center', p: 2 }}>
                    <LocationOn sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      New Booking
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => navigate('/tours')}
                    >
                      Book Now
                    </Button>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;
