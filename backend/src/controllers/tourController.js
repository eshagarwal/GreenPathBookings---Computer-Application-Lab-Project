import prisma from '../utils/prisma.js';

const createTour = async (req, res) => {
  try {
    const { title, description, destination, price, duration, maxCapacity, startDate, endDate, imageUrl } = req.body;
    
    // Only admins can create tours
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only administrators can create tours' });
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        description,
        destination,
        price: parseFloat(price),
        duration: parseInt(duration),
        maxCapacity: parseInt(maxCapacity),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        imageUrl
      }
    });

    res.status(201).json({
      message: 'Tour created successfully',
      tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ error: 'Failed to create tour' });
  }
};

const getTours = async (req, res) => {
  try {
    const { active } = req.query;
    const isAdmin = req.user.role === 'ADMIN';
    
    const where = {};
    if (!isAdmin || active === 'true') {
      where.isActive = true;
    }

    const tours = await prisma.tour.findMany({
      where,
      include: {
        bookings: {
          select: {
            id: true,
            numberOfPeople: true,
            status: true
          }
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'CONFIRMED']
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate available spots for each tour
    const toursWithAvailability = tours.map(tour => {
      const bookedPeople = tour.bookings
        .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'PENDING')
        .reduce((total, booking) => total + booking.numberOfPeople, 0);
      
      return {
        ...tour,
        availableSpots: tour.maxCapacity - bookedPeople,
        totalBookings: tour._count.bookings
      };
    });

    res.json(toursWithAvailability);
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
};

const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Calculate available spots
    const bookedPeople = tour.bookings
      .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'PENDING')
      .reduce((total, booking) => total + booking.numberOfPeople, 0);

    const tourWithAvailability = {
      ...tour,
      availableSpots: tour.maxCapacity - bookedPeople
    };

    res.json(tourWithAvailability);
  } catch (error) {
    console.error('Get tour by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, destination, price, duration, maxCapacity, startDate, endDate, imageUrl, isActive } = req.body;
    
    // Only admins can update tours
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only administrators can update tours' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (destination !== undefined) updateData.destination = destination;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (maxCapacity !== undefined) updateData.maxCapacity = parseInt(maxCapacity);
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

    const tour = await prisma.tour.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      message: 'Tour updated successfully',
      tour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.status(500).json({ error: 'Failed to update tour' });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins can delete tours
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only administrators can delete tours' });
    }

    // Check if tour has any bookings
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: true
      }
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    if (tour.bookings.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete tour with existing bookings. Deactivate instead.' 
      });
    }

    await prisma.tour.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
};

const toggleTourStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins can toggle tour status
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only administrators can toggle tour status' });
    }

    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: parseInt(id) },
      data: { isActive: !tour.isActive }
    });

    res.json({
      message: `Tour ${updatedTour.isActive ? 'activated' : 'deactivated'} successfully`,
      tour: updatedTour
    });
  } catch (error) {
    console.error('Toggle tour status error:', error);
    res.status(500).json({ error: 'Failed to toggle tour status' });
  }
};

export {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
  toggleTourStatus
};