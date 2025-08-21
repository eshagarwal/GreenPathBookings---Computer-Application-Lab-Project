import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import api from "../services/api";
import UserMenu from "../components/UserMenu";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // You will get user info from your auth logic, here we assume username stored in localStorage or context
  const user = { username: localStorage.getItem("username") || "User" };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get("/tours");
        setTours(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tours");
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <UserMenu user={user} />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Travel for yourself, not by yourself with our brand new, solo-only
          adventures.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Whether it’s a family retreat or a girls trip, customize a tour that
          fits you perfectly. Explore premium active adventures with perfectly
          paced itineraries, unique accommodations, and elevated dining.
        </Typography>
      </Box>

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
                <Card sx={{ backgroundColor: "#DDF6D2", boxShadow: 3 }}>
                  {tour.images && tour.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={tour.images[0]}
                      alt={tour.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {tour.title}
                    </Typography>

                    {/* Promotional Badge */}
                    {tour.promotions?.includes("On Sale") && (
                      <Box
                        sx={{
                          display: "inline-block",
                          mb: 1,
                          px: 1.5,
                          py: 0.5,
                          bgcolor: "secondary.main",
                          color: "white",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        On Sale
                      </Box>
                    )}

                    <Typography variant="body2" color="text.secondary" noWrap>
                      {tour.description}
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Location: {tour.location}
                    </Typography>

                    <Typography variant="subtitle2">
                      Price: ${tour.price}
                    </Typography>

                    <Button
                      size="small"
                      sx={{ mt: 2 }}
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/tours/${tour._id}`)}
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
