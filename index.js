const config = require('./utils/config');
const logger = require('./utils/logger');
const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Express server is running on ${config.PORT}`);
});
