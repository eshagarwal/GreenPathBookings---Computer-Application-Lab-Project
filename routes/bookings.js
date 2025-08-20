const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware.verifyToken, bookingController.createBooking);
router.get('/user', authMiddleware.verifyToken, bookingController.getUserBookings);
router.put('/cancel/:id', authMiddleware.verifyToken, bookingController.cancelBooking);

module.exports = router;
