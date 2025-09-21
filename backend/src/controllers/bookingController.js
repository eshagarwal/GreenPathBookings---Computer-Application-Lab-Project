import prisma from '../utils/prisma.js';

const createBooking = async (req, res) => {
  try {
    const { tourId, numberOfPeople, paymentData } = req.body;
    const userId = req.user.id;

    // Verify tour exists and is active
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(tourId) },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      }
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    if (!tour.isActive) {
      return res.status(400).json({ error: 'Tour is not available for booking' });
    }

    // Check availability
    const bookedPeople = tour.bookings.reduce((total, booking) => total + booking.numberOfPeople, 0);
    const availableSpots = tour.maxCapacity - bookedPeople;

    if (numberOfPeople > availableSpots) {
      return res.status(400).json({ 
        error: `Not enough spots available. Only ${availableSpots} spots remaining.` 
      });
    }

    // Calculate total price
    const totalPrice = tour.price * numberOfPeople;

    // Validate payment data if provided
    if (paymentData && paymentData.paymentStatus !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment was not completed successfully' });
    }

    const bookingData = {
      userId,
      tourId: parseInt(tourId),
      numberOfPeople: parseInt(numberOfPeople),
      totalPrice,
      status: paymentData ? 'CONFIRMED' : 'PENDING', // Auto-confirm if payment is provided
    };

    // Add payment information if provided
    if (paymentData) {
      bookingData.paymentId = paymentData.paymentId;
      bookingData.paymentStatus = paymentData.paymentStatus;
      bookingData.paymentMethod = paymentData.paymentMethod;
    }

    const booking = await prisma.booking.create({
      data: bookingData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        tour: true
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const bookings = await prisma.booking.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        tour: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdmin ? {} : { userId })
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        tour: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { numberOfPeople, status } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Check if booking exists and user has permission
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdmin ? {} : { userId })
      },
      include: {
        tour: {
          include: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED']
                },
                id: {
                  not: parseInt(id) // Exclude current booking from availability check
                }
              }
            }
          }
        }
      }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updateData = {};

    // Handle numberOfPeople update (check availability)
    if (numberOfPeople && numberOfPeople !== existingBooking.numberOfPeople) {
      const bookedPeople = existingBooking.tour.bookings.reduce((total, booking) => total + booking.numberOfPeople, 0);
      const availableSpots = existingBooking.tour.maxCapacity - bookedPeople;

      if (numberOfPeople > availableSpots + existingBooking.numberOfPeople) {
        return res.status(400).json({ 
          error: `Not enough spots available. Only ${availableSpots + existingBooking.numberOfPeople} spots available.` 
        });
      }

      updateData.numberOfPeople = parseInt(numberOfPeople);
      updateData.totalPrice = existingBooking.tour.price * numberOfPeople;
    }

    // Handle status update (admin only)
    if (status && isAdmin) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        tour: true
      }
    });

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Check if booking exists and user has permission
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        ...(isAdmin ? {} : { userId })
      }
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

export default {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};