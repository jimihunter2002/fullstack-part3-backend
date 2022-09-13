const config = require('./utils/config');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const { phonebookRouter, phonebookInfo } = require('./controllers/phonebooks');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();

//connect to DM

const url = `${config.MONGODB_URI}${config.USERNAME}:${config.PASSWORD}${config.MONGODB_URI_END}`;

logger.info('connecting to DB...', url);

mongoose
  .connect(url)
  .then(() => {
    logger.info('connected to DB');
  })
  .catch(err => logger.error('error connecting to MongoDB', err.message));

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.set('json spaces', 2);

// morgan logger
morgan.token('body', req => {
  return JSON.stringify(req.body);
});

//logger middleware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

app.use(middleware.requestLogger);

app.use('/api/persons', phonebookRouter);
app.use('/', phonebookInfo);

app.use(middleware.unknownEndpoint);

app.use(middleware.errorHandler);

module.exports = app;
