'use strict';

import path from 'path';
import _ from 'lodash';

const all = {
  env: process.env.NODE_ENV,

  //root path of the server
  root: path.normalize(__dirname + '/../..'),

  //auth port
  port: process.env.PORT || 3000,
  
  //secret for JWT
  secrets:{
    session: process.env.JWT_SECRET
  }, 

  roles:['guest','user','admin'],

  //mongoDB connection options
  mongo:{
    options:{
      db:{
        safe:true
      }
    }
  }

};

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {});
