const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { tourId, numberOfSpots } = req.body;
  const userId = req.user.userId;

  if (!tourId || !numberOfSpots) {
    return res.status(400).json({ msg: 'Tour ID and number of spots are required' });
  }

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ msg: 'Tour not found' });

    if (numberOfSpots > tour.availableSlots) {
      return res.status(400).json({ msg: 'Not enough available slots' });
    }

    // Optional: Reduce availableSlots here or after payment confirmation

    const booking = new Booking({
      tourId,
      userId,
      numberOfSpots,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error creating booking' });
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
  const userId = req.user.userId;
  try {
    const bookings = await Booking.find({ userId }).populate('tourId').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error fetching bookings' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.userId;

  try {
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    // Optional: Increase tour.availableSlots

    res.json({ msg: 'Booking cancelled', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error cancelling booking' });
  }
};
