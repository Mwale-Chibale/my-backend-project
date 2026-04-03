const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Protected route: Any logged-in user can book a ticket
router.post('/:eventId', authenticateUser, bookingController.createBooking);

module.exports = router;