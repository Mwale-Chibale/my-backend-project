const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

const sqlite = new Database(path.join(__dirname, '../../prisma/dev.db'));
const adapter = new PrismaBetterSqlite3(sqlite);
const prisma = new PrismaClient({ adapter });

const register = async (name, email, password, role) => {
  try {
    console.log('1. Starting registration for:', email);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('2. Checked for existing user');

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('3. Password hashed');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    console.log('4. User created');

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (err) {
    console.error('REGISTRATION ERROR:', err);
    throw err;
  }
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { token, role: user.role };
};

module.exports = { register, login };