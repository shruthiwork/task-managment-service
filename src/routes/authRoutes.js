const express = require('express');
const { registerController, loginController } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/schemas');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), registerController);
router.post('/login', authLimiter, validate(loginSchema), loginController);

module.exports = router;
