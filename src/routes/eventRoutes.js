const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');
const { validateEvent } = require('../middlewares/validationMiddleware'); // Import it

router.get('/', eventController.getAllEvents);
router.get('/:id/attendees', authenticateUser, authorizeRole('ORGANISER'), eventController.getEventAttendees);
router.post('/', authenticateUser, authorizeRole('ORGANISER'), validateEvent, eventController.createEvent);

module.exports = router;