import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Snackbar,
  CardMedia,
  CardActions,
  CircularProgress,
} from "@mui/material";
import Plot from "react-plotly.js";
import {
  People,
  BookmarkBorder,
  Dashboard,
  Edit,
  Delete,
  Visibility,
  Add,
  Tour,
  ToggleOff,
  ToggleOn,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import api, { bookingAPI } from "../services/api";

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalTours: 0,
    activeTours: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [openTourDialog, setOpenTourDialog] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [bookingUpdateLoading, setBookingUpdateLoading] = useState({});
  const [bookingDetailsDialog, setBookingDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    destination: "",
    price: "",
    duration: "",
    maxCapacity: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    isActive: true,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetTourForm = () => {
    setTourForm({
      title: "",
      description: "",
      destination: "",
      price: "",
      duration: "",
      maxCapacity: "",
      startDate: "",
      endDate: "",
      imageUrl: "",
      isActive: true,
    });
    setEditingTour(null);
  };

  const fetchTours = async () => {
    try {
      const response = await api.get("/tours");
      setTours(response.data);

      // Update stats
      const activeTours = response.data.filter((tour) => tour.isActive).length;
      setStats((prev) => ({
        ...prev,
        totalTours: response.data.length,
        activeTours,
      }));
    } catch (error) {
      console.error("Error fetching tours:", error);
      showSnackbar("Failed to fetch tours", "error");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setRecentBookings(response.data.bookings.slice(0, 10)); // Show latest 10
      setAllBookings(response.data.bookings); // Store all bookings for analytics

      // Calculate booking stats
      const totalBookings = response.data.bookings.length;
      const pendingBookings = response.data.bookings.filter(
        (b) => b.status === "PENDING"
      ).length;
      const confirmedBookings = response.data.bookings.filter(
        (b) => b.status === "CONFIRMED"
      ).length;

      setStats((prev) => ({
        ...prev,
        totalBookings,
        pendingBookings,
        confirmedBookings,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showSnackbar("Failed to fetch bookings", "error");
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchTours();
      fetchBookings();

      // Mock user count (you can implement this API endpoint)
      setStats((prev) => ({ ...prev, totalUsers: 125 }));
    }
  }, [user]);

  const handleTourSubmit = async () => {
    try {
      const formData = {
        ...tourForm,
        price: parseFloat(tourForm.price),
        duration: parseInt(tourForm.duration),
        maxCapacity: parseInt(tourForm.maxCapacity),
      };
      // ensure that endDate - startDate is exactly duration days
      const start = new Date(tourForm.startDate);
      const end = new Date(tourForm.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
      if (diffDays !== formData.duration) {
        showSnackbar(
          "Duration must match the difference between start and end dates",
          "error"
        );
        return;
      }

      if (editingTour) {
        await api.put(`/tours/${editingTour.id}`, formData);
        showSnackbar("Tour updated successfully");
      } else {
        await api.post("/tours", formData);
        showSnackbar("Tour created successfully");
      }

      setOpenTourDialog(false);
      resetTourForm();
      fetchTours();
    } catch (error) {
      console.error("Error saving tour:", error);
      showSnackbar(
        error.response?.data?.error || "Failed to save tour",
        "error"
      );
    }
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      price: tour.price.toString(),
      duration: tour.duration.toString(),
      maxCapacity: tour.maxCapacity.toString(),
      startDate: tour.startDate.split("T")[0],
      endDate: tour.endDate.split("T")[0],
      imageUrl: tour.imageUrl || "",
      isActive: tour.isActive,
    });
    setOpenTourDialog(true);
  };

  const handleToggleTourStatus = async (tourId) => {
    try {
      await api.patch(`/tours/${tourId}/toggle`);
      showSnackbar("Tour status updated successfully");
      fetchTours();
    } catch (error) {
      console.error("Error toggling tour status:", error);
      showSnackbar("Failed to update tour status", "error");
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this tour? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/tours/${tourId}`);
        showSnackbar("Tour deleted successfully");
        fetchTours();
      } catch (error) {
        console.error("Error deleting tour:", error);
        showSnackbar(
          error.response?.data?.error || "Failed to delete tour",
          "error"
        );
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    const statusActions = {
      CONFIRMED: "confirm",
      CANCELLED: "cancel",
      COMPLETED: "mark as completed",
    };

    const action = statusActions[newStatus];
    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) {
      return;
    }

    setBookingUpdateLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      showSnackbar(`Booking ${action}ed successfully`);
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error("Error updating booking status:", error);
      showSnackbar("Failed to update booking status", "error");
    } finally {
      setBookingUpdateLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "success";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setBookingDetailsDialog(true);
  };

  const handleCloseBookingDetails = () => {
    setBookingDetailsDialog(false);
    setSelectedBooking(null);
  };

  // Analytics Data Processing Functions
  const getBookingTrendsData = () => {
    if (!allBookings.length) return { dates: [], counts: [] };

    // Group bookings by date
    const bookingsByDate = {};
    allBookings.forEach((booking) => {
      const date = new Date(booking.createdAt).toISOString().split("T")[0];
      bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });

    // Sort dates and prepare data for chart
    const sortedDates = Object.keys(bookingsByDate).sort();
    const dates = sortedDates;
    const counts = sortedDates.map((date) => bookingsByDate[date]);

    return { dates, counts };
  };

  const getRevenueData = () => {
    if (!allBookings.length) return { dates: [], revenue: [] };

    const revenueByDate = {};
    allBookings
      .filter(
        (booking) =>
          booking.status === "CONFIRMED" || booking.status === "COMPLETED"
      )
      .forEach((booking) => {
        const date = new Date(booking.createdAt).toISOString().split("T")[0];
        revenueByDate[date] =
          (revenueByDate[date] || 0) + parseFloat(booking.totalPrice);
      });

    const sortedDates = Object.keys(revenueByDate).sort();
    const dates = sortedDates;
    const revenue = sortedDates.map((date) => revenueByDate[date]);

    return { dates, revenue };
  };

  const getTourPopularityData = () => {
    if (!allBookings.length || !tours.length) return { labels: [], values: [] };

    const bookingsByTour = {};
    allBookings.forEach((booking) => {
      if (booking.tour) {
        const tourTitle = booking.tour.title;
        bookingsByTour[tourTitle] = (bookingsByTour[tourTitle] || 0) + 1;
      }
    });

    const labels = Object.keys(bookingsByTour);
    const values = Object.values(bookingsByTour);

    return { labels, values };
  };

  const getBookingStatusData = () => {
    if (!allBookings.length) return { labels: [], values: [] };

    const statusCounts = {};
    allBookings.forEach((booking) => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const values = Object.values(statusCounts);

    return { labels, values };
  };

  const getMonthlyRevenueData = () => {
    if (!allBookings.length) return { months: [], revenue: [] };

    const revenueByMonth = {};
    allBookings
      .filter(
        (booking) =>
          booking.status === "CONFIRMED" || booking.status === "COMPLETED"
      )
      .forEach((booking) => {
        const date = new Date(booking.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        revenueByMonth[monthKey] =
          (revenueByMonth[monthKey] || 0) + parseFloat(booking.totalPrice);
      });

    const sortedMonths = Object.keys(revenueByMonth).sort();
    const months = sortedMonths.map((month) => {
      const [year, monthNum] = month.split("-");
      return new Date(year, monthNum - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    });
    const revenue = sortedMonths.map((month) => revenueByMonth[month]);

    return { months, revenue };
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage users, tours, bookings, and system settings
          </Typography>
        </Box>

        {/* Admin Access Check */}
        {user?.role !== "ADMIN" && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Access Denied: You do not have administrator privileges.
          </Alert>
        )}

        {user?.role === "ADMIN" && (
          <>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <People
                      sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                    />
                    <Typography variant="h4" component="div">
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Tour sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" component="div">
                      {stats.activeTours}/{stats.totalTours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Tours
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Dashboard
                      sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
                    />
                    <Typography variant="h4" component="div">
                      {stats.pendingBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Bookings
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <BookmarkBorder
                      sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                    />
                    <Typography variant="h4" component="div">
                      {stats.totalBookings}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Tabs for different management sections */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
              >
                <Tab label="Tours Management" />
                <Tab label="Bookings Overview" />
                <Tab label="Analytics" />
              </Tabs>
            </Paper>

            {/* Tour Management Tab */}
            {activeTab === 0 && (
              <Paper sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    Tour Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenTourDialog(true)}
                  >
                    Create New Tour
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {tours.map((tour) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tour.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {tour.imageUrl && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={tour.imageUrl}
                            alt={tour.title}
                            sx={{ objectFit: "cover" }}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="h3"
                              gutterBottom
                            >
                              {tour.title}
                            </Typography>
                            <Chip
                              label={tour.isActive ? "Active" : "Inactive"}
                              color={tour.isActive ? "success" : "default"}
                              size="small"
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {tour.destination}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {tour.description.length > 100
                              ? `${tour.description.substring(0, 100)}...`
                              : tour.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              <strong>Price:</strong> ${tour.price}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Duration:</strong> {tour.duration} days
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">
                              <strong>Capacity:</strong> {tour.maxCapacity}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Available:</strong> {tour.availableSpots}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            <strong>Dates:</strong>{" "}
                            {new Date(tour.startDate).toLocaleDateString()} -{" "}
                            {new Date(tour.endDate).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditTour(tour)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={tour.isActive ? "Deactivate" : "Activate"}
                          >
                            <IconButton
                              onClick={() => handleToggleTourStatus(tour.id)}
                              size="small"
                            >
                              {tour.isActive ? (
                                <ToggleOn color="success" />
                              ) : (
                                <ToggleOff />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteTour(tour.id)}
                              size="small"
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {tours.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No tours found. Create your first tour to get started!
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}

            {/* Bookings Overview Tab */}
            {activeTab === 1 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Recent Bookings
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Tour</TableCell>
                        <TableCell>People</TableCell>
                        <TableCell>Total Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Booking Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>
                            {booking.user.firstName} {booking.user.lastName}
                          </TableCell>
                          <TableCell>{booking.tour?.title || "N/A"}</TableCell>
                          <TableCell>{booking.numberOfPeople}</TableCell>
                          <TableCell>${booking.totalPrice}</TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status}
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {booking.status === "PENDING" && (
                              <>
                                <Tooltip title="Confirm Booking">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        booking.id,
                                        "CONFIRMED"
                                      )
                                    }
                                    disabled={bookingUpdateLoading[booking.id]}
                                  >
                                    {bookingUpdateLoading[booking.id] ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      <CheckCircle />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel Booking">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        booking.id,
                                        "CANCELLED"
                                      )
                                    }
                                    disabled={bookingUpdateLoading[booking.id]}
                                  >
                                    {bookingUpdateLoading[booking.id] ? (
                                      <CircularProgress size={20} />
                                    ) : (
                                      <Cancel />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {booking.status === "CONFIRMED" && (
                              <Tooltip title="Mark as Completed">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleBookingStatusUpdate(
                                      booking.id,
                                      "COMPLETED"
                                    )
                                  }
                                  disabled={bookingUpdateLoading[booking.id]}
                                >
                                  {bookingUpdateLoading[booking.id] ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <HourglassEmpty />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleViewBookingDetails(booking)
                                }
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {recentBookings.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No bookings found.
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}

            {/* Analytics Tab */}
            {activeTab === 2 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Analytics Dashboard
                </Typography>

                <Grid container spacing={3}>
                  {/* Booking Trends Chart */}
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Daily Booking Trends
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <Plot
                            data={[
                              {
                                x: getBookingTrendsData().dates,
                                y: getBookingTrendsData().counts,
                                type: "scatter",
                                mode: "lines+markers",
                                line: { color: "#1976d2", width: 3 },
                                marker: { size: 8, color: "#1976d2" },
                                name: "Bookings",
                              },
                            ]}
                            layout={{
                              title: "",
                              xaxis: { title: "Date" },
                              yaxis: { title: "Number of Bookings" },
                              margin: { l: 50, r: 50, t: 20, b: 50 },
                              height: 350,
                              showlegend: false,
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Revenue Trends Chart */}
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Daily Revenue Trends
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <Plot
                            data={[
                              {
                                x: getRevenueData().dates,
                                y: getRevenueData().revenue,
                                type: "scatter",
                                mode: "lines+markers",
                                line: { color: "#2e7d32", width: 3 },
                                marker: { size: 8, color: "#2e7d32" },
                                name: "Revenue",
                                fill: "tozeroy",
                                fillcolor: "rgba(46, 125, 50, 0.1)",
                              },
                            ]}
                            layout={{
                              title: "",
                              xaxis: { title: "Date" },
                              yaxis: { title: "Revenue ($)" },
                              margin: { l: 50, r: 50, t: 20, b: 50 },
                              height: 350,
                              showlegend: false,
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Tour Popularity Chart */}
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Tour Popularity
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <Plot
                            data={[
                              {
                                labels: getTourPopularityData().labels,
                                values: getTourPopularityData().values,
                                type: "pie",
                                textposition: "inside",
                                textinfo: "label+percent",
                                hole: 0.3,
                                marker: {
                                  colors: [
                                    "#1976d2",
                                    "#2e7d32",
                                    "#ed6c02",
                                    "#d32f2f",
                                    "#7b1fa2",
                                    "#c2185b",
                                  ],
                                },
                              },
                            ]}
                            layout={{
                              title: "",
                              margin: { l: 20, r: 20, t: 20, b: 20 },
                              height: 350,
                              showlegend: true,
                              legend: { x: 1, y: 0.5 },
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Booking Status Distribution */}
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Card sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Booking Status Distribution
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <Plot
                            data={[
                              {
                                x: getBookingStatusData().labels,
                                y: getBookingStatusData().values,
                                type: "bar",
                                marker: {
                                  color: getBookingStatusData().labels.map(
                                    (status) => {
                                      switch (status) {
                                        case "PENDING":
                                          return "#ed6c02";
                                        case "CONFIRMED":
                                          return "#2e7d32";
                                        case "CANCELLED":
                                          return "#d32f2f";
                                        case "COMPLETED":
                                          return "#1976d2";
                                        default:
                                          return "#9e9e9e";
                                      }
                                    }
                                  ),
                                },
                              },
                            ]}
                            layout={{
                              title: "",
                              xaxis: { title: "Status" },
                              yaxis: { title: "Number of Bookings" },
                              margin: { l: 50, r: 50, t: 20, b: 50 },
                              height: 350,
                              showlegend: false,
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Monthly Revenue Chart */}
                  <Grid size={{ xs: 12 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Monthly Revenue Overview
                        </Typography>
                        <Box sx={{ height: 400 }}>
                          <Plot
                            data={[
                              {
                                x: getMonthlyRevenueData().months,
                                y: getMonthlyRevenueData().revenue,
                                type: "bar",
                                marker: {
                                  color: "#1976d2",
                                  opacity: 0.8,
                                },
                                name: "Monthly Revenue",
                              },
                            ]}
                            layout={{
                              title: "",
                              xaxis: { title: "Month" },
                              yaxis: { title: "Revenue ($)" },
                              margin: { l: 50, r: 50, t: 20, b: 80 },
                              height: 350,
                              showlegend: false,
                              bargap: 0.3,
                            }}
                            config={{ displayModeBar: false, responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Key Metrics Summary */}
                  <Grid size={{ xs: 12 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Key Performance Indicators
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "primary.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="h4" color="primary.main">
                                $
                                {getRevenueData()
                                  .revenue.reduce((sum, val) => sum + val, 0)
                                  .toFixed(2)}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Total Revenue
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "success.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="h4" color="success.main">
                                $
                                {allBookings.length
                                  ? (
                                      getRevenueData().revenue.reduce(
                                        (sum, val) => sum + val,
                                        0
                                      ) /
                                        allBookings.filter(
                                          (b) =>
                                            b.status === "CONFIRMED" ||
                                            b.status === "COMPLETED"
                                        ).length || 0
                                    ).toFixed(2)
                                  : "0.00"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Average Booking Value
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "warning.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="h4" color="warning.main">
                                {allBookings.length
                                  ? (
                                      (allBookings.filter(
                                        (b) =>
                                          b.status === "CONFIRMED" ||
                                          b.status === "COMPLETED"
                                      ).length /
                                        allBookings.length) *
                                      100
                                    ).toFixed(1)
                                  : "0.0"}
                                %
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Conversion Rate
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Box
                              sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "info.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="h4" color="info.main">
                                {tours.filter((t) => t.isActive).length}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Active Tours
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {allBookings.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Analytics Data Available
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Start getting bookings to see analytics and insights here.
                    </Typography>
                  </Box>
                )}
              </Paper>
            )}
          </>
        )}

        {/* Tour Creation/Edit Dialog */}
        <Dialog
          open={openTourDialog}
          onClose={() => {
            setOpenTourDialog(false);
            resetTourForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingTour ? "Edit Tour" : "Create New Tour"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                fullWidth
                label="Tour Title"
                value={tourForm.title}
                onChange={(e) =>
                  setTourForm({ ...tourForm, title: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={tourForm.description}
                onChange={(e) =>
                  setTourForm({ ...tourForm, description: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                label="Destination"
                value={tourForm.destination}
                onChange={(e) =>
                  setTourForm({ ...tourForm, destination: e.target.value })
                }
                required
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Price ($)"
                  type="number"
                  value={tourForm.price}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, price: e.target.value })
                  }
                  required
                />
                <TextField
                  label="Duration (days)"
                  type="number"
                  value={tourForm.duration}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, duration: e.target.value })
                  }
                  required
                />
                <TextField
                  label="Max Capacity"
                  type="number"
                  value={tourForm.maxCapacity}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, maxCapacity: e.target.value })
                  }
                  required
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={tourForm.startDate}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, startDate: e.target.value })
                  }
                  slotProps={{
                    input: {
                      inputProps: {
                        min: new Date().toISOString().split("T")[0],
                      },
                    },
                    inputLabel: { shrink: true },
                  }}
                  required
                />
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={tourForm.endDate}
                  onChange={(e) =>
                    setTourForm({ ...tourForm, endDate: e.target.value })
                  }
                  slotProps={{
                    input: {
                      inputProps: {
                        min:
                          tourForm.startDate ||
                          new Date().toISOString().split("T")[0],
                        max: tourForm.startDate
                          ? new Date(
                              new Date(tourForm.startDate).getTime() +
                                (tourForm.duration
                                  ? tourForm.duration * 24 * 60 * 60 * 1000
                                  : 365 * 24 * 60 * 60 * 1000)
                            )
                              .toISOString()
                              .split("T")[0]
                          : undefined,
                      },
                    },
                    inputLabel: { shrink: true },
                  }}
                  required
                  disabled={!tourForm.startDate || !tourForm.duration}
                />
              </Box>
              <TextField
                fullWidth
                label="Image URL (optional)"
                value={tourForm.imageUrl}
                onChange={(e) =>
                  setTourForm({ ...tourForm, imageUrl: e.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={tourForm.isActive}
                    onChange={(e) =>
                      setTourForm({ ...tourForm, isActive: e.target.checked })
                    }
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenTourDialog(false);
                resetTourForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTourSubmit}
              variant="contained"
              disabled={
                !tourForm.title ||
                !tourForm.description ||
                !tourForm.destination ||
                !tourForm.price ||
                !tourForm.duration ||
                !tourForm.maxCapacity ||
                !tourForm.startDate ||
                !tourForm.endDate
              }
            >
              {editingTour ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Booking Details Dialog */}
        <Dialog
          open={bookingDetailsDialog}
          onClose={handleCloseBookingDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Booking Details - #{selectedBooking?.id}</DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
              >
                {/* Customer Information */}
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.user.firstName}{" "}
                        {selectedBooking.user.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.user.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Tour Information */}
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    Tour Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tour Title
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.tour?.title || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Destination
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.tour?.destination || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.tour?.duration || "N/A"} days
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tour Dates
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.tour?.startDate
                          ? new Date(
                              selectedBooking.tour.startDate
                            ).toLocaleDateString()
                          : "N/A"}{" "}
                        -{" "}
                        {selectedBooking.tour?.endDate
                          ? new Date(
                              selectedBooking.tour.endDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Booking Details */}
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    Booking Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Number of People
                      </Typography>
                      <Typography variant="body1">
                        {selectedBooking.numberOfPeople}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Price
                      </Typography>
                      <Typography
                        variant="body1"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        ${selectedBooking.totalPrice}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={selectedBooking.status}
                        color={getStatusColor(selectedBooking.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Booking Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          selectedBooking.createdAt
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {new Date(
                          selectedBooking.createdAt
                        ).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Payment Information */}
                {(selectedBooking.paymentId ||
                  selectedBooking.paymentStatus ||
                  selectedBooking.paymentMethod) && (
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "success.50",
                      border: 1,
                      borderColor: "success.200",
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="success.dark">
                      Payment Information
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedBooking.paymentId && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="body2" color="text.secondary">
                            Payment ID
                          </Typography>
                          <Typography variant="body1" fontFamily="monospace">
                            {selectedBooking.paymentId}
                          </Typography>
                        </Grid>
                      )}
                      {selectedBooking.paymentMethod && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Method
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {selectedBooking.paymentMethod}
                          </Typography>
                        </Grid>
                      )}
                      {selectedBooking.paymentStatus && (
                        <Grid size={{ xs: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Payment Status
                          </Typography>
                          <Chip
                            label={selectedBooking.paymentStatus}
                            color={
                              selectedBooking.paymentStatus === "COMPLETED"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}

                {/* Tour Description */}
                {selectedBooking.tour?.description && (
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="h6" gutterBottom>
                      Tour Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedBooking.tour.description}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBookingDetails}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default AdminPanel;
