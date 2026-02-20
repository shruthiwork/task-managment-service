const config = {
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  env: process.env.NODE_ENV || 'development',
};

module.exports = config;
