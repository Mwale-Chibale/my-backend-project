require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');



app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);
const errorHandler = require('./middlewares/errorHandler');



app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/test-error', (req, res, next) => {
  // We simulate a database crash or unexpected bug
  const fakeError = new Error('The database connection was mysteriously lost!');
  fakeError.statusCode = 503; // Service Unavailable
  next(fakeError); // Passing it to 'next' throws it into our global net
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
