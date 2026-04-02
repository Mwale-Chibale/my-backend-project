const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');

// Public route: Anyone can see the list of events
router.get('/', eventController.getAllEvents);

// Protected route: Only logged-in Organisers can create an event
// Request -> Is Logged In? -> Is Organiser? -> Create Event
router.post('/', authenticateUser, authorizeRole('ORGANISER'), eventController.createEvent);

module.exports = router;