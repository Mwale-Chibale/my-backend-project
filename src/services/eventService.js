const prisma = require('../config/db');

const createEvent = async (data) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      // Prisma requires Date objects, so we parse the incoming string
      date: new Date(data.date), 
      // Ensure capacity is an integer
      capacity: parseInt(data.capacity), 
      organiserId: data.organiserId, // We will grab this from the JWT!
    },
  });
};

const getAllEvents = async () => {
  return await prisma.event.findMany({
    // Let's include the organiser's name so attendees know who is hosting
    include: {
      organiser: {
        select: { name: true, email: true } 
      }
    }
  });
};
const getEventAttendees = async (eventId, organiserId) => {
  const eventIdInt = parseInt(eventId);

  // 1. Fetch the event, counting bookings and grabbing the user profiles attached to those bookings
  const event = await prisma.event.findUnique({
    where: { id: eventIdInt },
    select: {
      title: true,
      capacity: true,
      organiserId: true,
      _count: {
        select: { bookings: true } // Automatically counts tickets sold!
      },
      bookings: {
        select: {
          user: {
            select: { id: true, name: true, email: true } // Fetches the attendee list safely
          }
        }
      }
    }
  });

  if (!event) throw new Error('Event not found.');
  
  // 2. Security Check: Only the host of the event should see the guest list
  if (event.organiserId !== organiserId) {
    throw new Error('Unauthorized: You are not the organiser of this event.');
  }

  // 3. Format the data to make it perfectly clean for the frontend
  return {
    eventTitle: event.title,
    capacity: event.capacity,
    ticketsSold: event._count.bookings,
    attendees: event.bookings.map(booking => booking.user)
  };
};

// Update your exports to include the new function!
module.exports = { createEvent, getAllEvents, getEventAttendees };


//adapted from a combination of Claude AI and Gemini
