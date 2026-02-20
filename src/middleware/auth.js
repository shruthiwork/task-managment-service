const jwt = require('jsonwebtoken');
const config = require('../config');
const { findById } = require('../repositories/userRepository');

async function jwtMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return next({ status: 401, message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return next({ status: 401, message: 'Invalid or expired token' });
    }
    const user = await findById(payload.sub);
    if (!user) return next({ status: 401, message: 'Invalid token user' });
    req.user = { id: user.id, email: user.email, name: user.name };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { jwtMiddleware };
