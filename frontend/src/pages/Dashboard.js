import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';
import api from '../services/api';
import UserMenu from '../components/UserMenu';

const Dashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // You will get user info from your auth logic, here we assume username stored in localStorage or context
  const user = { username: localStorage.getItem('username') || 'User' };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/tours');
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tours');
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <UserMenu user={user} />
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Tours
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3}>
          {!loading &&
            !error &&
            tours.map((tour) => (
              <Grid item xs={12} sm={6} md={4} key={tour._id}>
                <Card sx={{ backgroundColor: '#DDF6D2', boxShadow: 3 }}>
                  {tour.images && tour.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={tour.images[0]}
                      alt={tour.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{tour.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {tour.description}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Location: {tour.location}
                    </Typography>
                    <Typography variant="subtitle2">Price: ${tour.price}</Typography>
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      variant="contained"
                      color="primary"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
