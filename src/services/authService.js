const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { createUser, findByEmail } = require('../repositories/userRepository');

async function register({ name, email, password }) {
  const existing = await findByEmail(email);
  if (existing) throw { status: 400, message: 'Email already registered' };
  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashed });
  return {
    id: user.id, name: user.name, email: user.email, createdAt: user.createdAt,
  };
}

async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return { token, expiresIn: config.jwtExpiresIn };
}

module.exports = { register, login };
