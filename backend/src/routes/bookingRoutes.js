import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import middleware from '../middleware/authMiddleware.js';

const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = bookingController;
const { authMiddleware, adminMiddleware } = middleware

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

// Booking routes
router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;