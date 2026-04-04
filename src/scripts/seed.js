const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
require('dotenv').config();

// Re-create the Prisma 7 connection exactly like we did in db.js
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
});
const prisma = new PrismaClient({ adapter });

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // 1. Hash a standard password everyone can use to log in
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create an Organiser
    const organiser = await prisma.user.upsert({
      where: { email: 'admin@events.com' },
      update: {}, // If they already exist, do nothing
      create: {
        name: 'Alice The Admin',
        email: 'admin@events.com',
        password: hashedPassword,
        role: 'ORGANISER',
      },
    });
    console.log(' Organiser created:', organiser.email);

    // Create an Attendee
    const attendee = await prisma.user.upsert({
      where: { email: 'test@attendee.com' },
      update: {},
      create: {
        name: 'Bob The Attendee',
        email: 'test@attendee.com',
        password: hashedPassword,
        role: 'ATTENDEE',
      },
    });
    console.log(' Attendee created:', attendee.email);

    //Create some sample events
    const event1 = await prisma.event.create({
      data: {
        title: 'Prisma & Node.js Masterclass',
        description: 'Learn how to build scalable backend systems.',
        date: new Date('2026-08-20T10:00:00Z'),
        capacity: 100,
        organiserId: organiser.id,
      },
    });

    const event2 = await prisma.event.create({
      data: {
        title: 'Tech Startup Mixer',
        description: 'Networking event for local developers and founders.',
        date: new Date('2026-09-05T18:00:00Z'),
        capacity: 50,
        organiserId: organiser.id,
      },
    });
    console.log('Events created:', event1.title, '&', event2.title);

    console.log('Seeding finished successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect(); // Always disconnect from the DB when the script finishes
  }
};

// Run the function
seedDatabase();