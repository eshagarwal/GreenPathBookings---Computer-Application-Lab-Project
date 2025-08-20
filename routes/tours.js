const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authMiddleware = require('../middlewares/auth');

// Public route - get tours with filters
router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);

// Protected routes - admin only (add auth middleware)
router.post('/', authMiddleware.verifyAdmin, tourController.createTour);
router.put('/:id', authMiddleware.verifyAdmin, tourController.updateTour);
router.delete('/:id', authMiddleware.verifyAdmin, tourController.deleteTour);

module.exports = router;
