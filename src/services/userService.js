const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

const findById = (id) => {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { findById };