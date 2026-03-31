const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

// In Prisma 7, you MUST use an adapter, and pass the URL directly to it.
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db"
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;