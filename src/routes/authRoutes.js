const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middlewares/validationMiddleware'); // Import it

// Add the validation middleware right before the controller
router.post('/register', validateRegistration, authController.register);
router.post('/login', authController.login);

module.exports = router;