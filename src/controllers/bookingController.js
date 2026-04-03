const bookingService = require('../services/bookingService');

const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // From the JWT token
    const { eventId } = req.params; // From the URL

    const booking = await bookingService.bookEvent(userId, eventId);
    
    res.status(201).json({
      message: 'Ticket successfully booked!',
      booking
    });
  } catch (err) {
    // Return a 400 Bad Request if the event is sold out or they already booked
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createBooking };