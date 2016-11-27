'use strict';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import config from './environments'
import logger from './logger';

export default (app)=>{
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(morgan('combined',{'stream':logger.stream}));
  app.use(errorHandler());
};
