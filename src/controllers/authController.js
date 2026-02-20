const { register, login } = require('../services/authService');
const { successResponse } = require('../utils/response');

async function registerController(req, res, next) {
  try {
    const payload = req.validated || req.body;
    const user = await register(payload);
    return res.status(201).json(successResponse('User registered', user));
  } catch (err) {
    return next(err);
  }
}

async function loginController(req, res, next) {
  try {
    const payload = req.validated || req.body;
    const token = await login(payload);
    return res.json(successResponse('Authenticated', token));
  } catch (err) {
    return next(err);
  }
}

module.exports = { registerController, loginController };
