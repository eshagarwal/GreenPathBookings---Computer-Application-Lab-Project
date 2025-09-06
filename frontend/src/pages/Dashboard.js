import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  IconButton,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
} from "@mui/material";
import {
  Search,
  LocationOn,
  AccessTime,
  Group,
  FavoriteBorder,
  Favorite,
  FilterList,
} from "@mui/icons-material";
import api from "../services/api";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const user = { username: localStorage.getItem("username") || "User" };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get("/tours");
        setTours(response.data);
        setFilteredTours(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load tours");
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = tours.filter((tour) => {
      const matchesSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        tour.price >= priceRange[0] && tour.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    // Sort tours
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "duration":
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

    setFilteredTours(filtered);
  }, [tours, searchQuery, priceRange, sortBy]);

  const toggleFavorite = (tourId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(tourId)) {
      newFavorites.delete(tourId);
    } else {
      newFavorites.add(tourId);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "success";
      case "moderate":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              🌿 GreenPath Bookings
            </Typography>
          </Box>
          <UserMenu user={user} />
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          // bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
          borderRadius: 2,
          mx: 2,
          mt: 2,
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Discover Your Next Adventure
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
          Travel for yourself, not by yourself with our brand new, solo-only
          adventures.
        </Typography>

        {/* Search Bar */}
        <Paper sx={{ p: 2, maxWidth: 800, mx: "auto", mt: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search destinations, tours, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="popularity">Popularity</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="duration">Duration</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderRadius: 2,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    background: "rgba(102, 126, 234, 0.08)",
                  },
                }}
              >
                Filters
              </Button>
            </Grid>
          </Grid>

          {/* Filters Panel */}
          {showFilters && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5000}
                    valueLabelFormat={(value) => `$${value}`}
                    sx={{
                      color: "#667eea",
                      "& .MuiSlider-thumb": {
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      },
                    }}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">${priceRange[0]}</Typography>
                    <Typography variant="body2">${priceRange[1]}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>

      <Container sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Available Tours ({filteredTours.length})
          </Typography>
        </Box>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={3}>
          {!loading &&
            !error &&
            filteredTours.map((tour) => (
              <Grid item xs={12} sm={6} key={tour._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    {tour.images && tour.images.length > 0 && (
                      <CardMedia
                        sx={{ height: 220 }}
                        image={tour.images[0]}
                        title={tour.title}
                      />
                    )}

                    {/* Favorite Button */}
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                      }}
                      onClick={() => toggleFavorite(tour._id)}
                    >
                      {favorites.has(tour._id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>

                    {/* Badges */}
                    <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
                      {tour.promotions?.includes("On Sale") && (
                        <Chip
                          label="On Sale"
                          color="secondary"
                          size="small"
                          sx={{ mr: 1, fontWeight: "bold" }}
                        />
                      )}
                      {tour.difficulty && (
                        <Chip
                          label={tour.difficulty}
                          color={getDifficultyColor(tour.difficulty)}
                          size="small"
                          variant="outlined"
                          sx={{ bgcolor: "rgba(255,255,255,0.9)" }}
                        />
                      )}
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      fontWeight="bold"
                      sx={{
                        minHeight: "64px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                      }}
                    >
                      {tour.title}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={tour.rating || 4.5}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        ({tour.reviewCount || 0} reviews)
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        minHeight: "60px",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {tour.description?.length > 120
                        ? `${tour.description.substring(0, 120)}...`
                        : tour.description}
                    </Typography>

                    {/* Tour Details */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                        minHeight: "32px",
                      }}
                    >
                      <Chip
                        icon={<LocationOn />}
                        label={tour.location}
                        variant="outlined"
                        size="small"
                      />
                      {tour.duration && (
                        <Chip
                          icon={<AccessTime />}
                          label={`${tour.duration} days`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                      {tour.maxGroupSize && (
                        <Chip
                          icon={<Group />}
                          label={`Max ${tour.maxGroupSize}`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          ${tour.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per person
                        </Typography>
                      </Box>
                      {tour.availableSpots && (
                        <Typography
                          variant="body2"
                          color="success.main"
                          sx={{ fontWeight: "medium" }}
                        >
                          {tour.availableSpots} spots left
                        </Typography>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, mt: "auto" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/tours/${tour._id}`)}
                      sx={{ mr: 1, flex: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/book/${tour._id}`)}
                      sx={{ flex: 1 }}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        {filteredTours.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No tours found matching your criteria
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, 5000]);
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
