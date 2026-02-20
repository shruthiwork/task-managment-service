const { createLogger, transports, format } = require('winston');

const {
  combine, timestamp, printf, colorize, errors,
} = format;
const { env } = require('../config');

const logFormat = printf(({
  level, message, timestamp: ts, stack, ...meta
}) => {
  const base = `${ts} [${level}]: ${message}`;
  if (stack) return `${base} - ${stack}`;
  return `${base} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const logger = createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports: [new transports.Console({ format: combine(colorize(), timestamp(), logFormat) })],
});

module.exports = { logger };
