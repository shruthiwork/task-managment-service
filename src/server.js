const http = require('http');
const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

module.exports = server;
