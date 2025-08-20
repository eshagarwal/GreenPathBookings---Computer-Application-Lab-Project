const Tour = require('../models/Tour');

// Create a new tour (admin only)
exports.createTour = async (req, res) => {
  try {
    const tourData = req.body;
    tourData.createdBy = req.user.userId; // Requires auth middleware to set req.user
    const tour = new Tour(tourData);
    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error creating tour' });
  }
};

// Get all tours with optional filtering and pagination
exports.getTours = async (req, res) => {
  try {
    const { region, priceMin, priceMax, environmentalRatingMin, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filters = {};

    if (region) filters.region = region;
    if (priceMin) filters.price = { ...filters.price, $gte: Number(priceMin) };
    if (priceMax) filters.price = { ...filters.price, $lte: Number(priceMax) };
    if (environmentalRatingMin) filters.environmentalRating = { $gte: Number(environmentalRatingMin) };
    if (startDate) filters.startDate = { ...filters.startDate, $gte: new Date(startDate) };
    if (endDate) filters.endDate = { ...filters.endDate, $lte: new Date(endDate) };

    const tours = await Tour.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ startDate: 1 });

    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error fetching tours' });
  }
};

// Get a single tour by ID
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'Tour not found' });
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error fetching tour' });
  }
};

// Update a tour (admin only)
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'Tour not found' });

    // Optional: check if req.user.userId equals tour.createdBy for authorization

    Object.assign(tour, req.body);
    await tour.save();
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error updating tour' });
  }
};

// Delete a tour (admin only)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'Tour not found' });

    // Optional: check if req.user.userId equals tour.createdBy for authorization

    await tour.remove();
    res.json({ msg: 'Tour deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error deleting tour' });
  }
};
