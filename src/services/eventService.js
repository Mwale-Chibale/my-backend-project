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

module.exports = { createEvent, getAllEvents };