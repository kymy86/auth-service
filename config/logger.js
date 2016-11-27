'use strict';

import winston from 'winston';
import path from 'path';
import fs from 'fs';
import winstonDailyRotate from 'winston-daily-rotate-file';
const env = process.env.NODE_ENV;
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = path.normalize(__dirname + '/..') + "logs";
winston.emitErrs = true;

if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}

const logger = new (winston.Logger) ({
  transports: [
    new (winstonDailyRotate) ({
      level: 'development' === env ? 'debug' : 'info',
      filename: path.join(logDir,'-messages.log'),
      handleExceptions: true,
      timestamp: tsFormat,
      json: true,
      datePattern: 'yyyy-MM-dd',
      prepend: true
    }),
    new (winston.transports.Console) ({
      level: 'development' === env ? 'debug' : 'info',
      handleExceptions:true,
      json: false,
      timestamp: tsFormat,
      colorize:true
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: (message,encoding)=>   {
    logger.info(message);
  }
};

export default logger