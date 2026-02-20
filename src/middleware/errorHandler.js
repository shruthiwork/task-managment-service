const { logger } = require('../utils/logger');
const { errorResponse } = require('../utils/response');
const { env } = require('../config');

function notFoundHandler(req, res) {
  res.status(404).json(errorResponse('Not Found'));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const payload = { message };
  if (env !== 'production' && err.stack) payload.stack = err.stack;
  logger.error(message, { status, details: err.details || null });
  res.status(status).json(errorResponse(message, env !== 'production' ? { details: err.details || null } : null));
}

module.exports = { notFoundHandler, errorHandler };
