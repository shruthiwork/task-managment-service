require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('./routes');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(xss());
app.use(mongoSanitize());

// CORS
const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

app.use(requestLogger);

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

// handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', { message: err?.message || err });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { message: err?.message || err });
  process.exit(1);
});

module.exports = app;
