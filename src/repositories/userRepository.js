const { v4: uuidv4 } = require('uuid');
const store = require('../store/inMemoryStore');

async function createUser({ name, email, password }) {
  const now = new Date().toISOString();
  const user = {
    id: uuidv4(),
    name,
    email,
    password,
    createdAt: now,
    updatedAt: now,
  };
  store.users.push(user);
  return user;
}

async function findByEmail(email) {
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findById(id) {
  return store.users.find((u) => u.id === id) || null;
}

module.exports = { createUser, findByEmail, findById };
