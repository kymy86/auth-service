'use strict';

import express from 'express';
import mongoose from 'mongoose';
import config from './config/environments';
import logger from './config/logger.js';

//connect to database
mongoose.connect(config.mongo.uri,config.mongo.options);

if (config.seedDb) { require('./config/seed')}

const app = express();
const server = require('http').createServer(app);

require('./config/express').default(app);
require('./routes').default(app);

server.listen(config.port,()=>{
  logger.info(`Express server listening on ${config.port}, in ${config.env} mode`);
})

exports = module.exports = app;