const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateUser, authorizeRole } = require('../middlewares/authMiddleware');
const { validateEvent } = require('../middlewares/validationMiddleware'); // Import it

router.get('/', eventController.getAllEvents);

// Add the validation right after checking their role, but before creating the event
router.post('/', authenticateUser, authorizeRole('ORGANISER'), validateEvent, eventController.createEvent);

module.exports = router;