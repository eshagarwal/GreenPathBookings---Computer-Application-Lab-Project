import express from 'express';
import {
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
  toggleTourStatus
} from '../controllers/tourController.js';
import middleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All tour routes require authentication
router.use(middleware.authMiddleware);

// GET /api/tours - Get all tours (users see active only, admins see all)
router.get('/', getTours);

// GET /api/tours/:id - Get tour by ID
router.get('/:id', getTourById);

// POST /api/tours - Create new tour (admin only)
router.post('/', createTour);

// PUT /api/tours/:id - Update tour (admin only)
router.put('/:id', updateTour);

// DELETE /api/tours/:id - Delete tour (admin only)
router.delete('/:id', deleteTour);

// PATCH /api/tours/:id/toggle - Toggle tour active status (admin only)
router.patch('/:id/toggle', toggleTourStatus);

export default router;