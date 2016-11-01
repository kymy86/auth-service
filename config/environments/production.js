'use strict';

module.exports = {

mongo:{
  uri: `mongodb://${process.env.MONGODB_ADDR}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`,
  options: {
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS
  }
},
seedDb: false

};
