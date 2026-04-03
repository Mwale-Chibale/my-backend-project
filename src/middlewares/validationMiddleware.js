// Validates incoming data for a new user
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are strictly required.' });
  }
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // If everything is perfect, pass the request to the controller
  next();
};

// Validates incoming data for a new event
const validateEvent = (req, res, next) => {
  const { title, date, capacity } = req.body;

  if (!title || !date || !capacity) {
    return res.status(400).json({ error: 'Title, date, and capacity are strictly required.' });
  }
  
  // Ensure capacity is a positive number
  const parsedCapacity = parseInt(capacity);
  if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
    return res.status(400).json({ error: 'Capacity must be a valid number greater than 0.' });
  }

  next();
};

module.exports = { validateRegistration, validateEvent };