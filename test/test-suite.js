'use strict';

import app from '../';
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

chai.use(chaiHttp);
chai.use(chaiAsPromised);
global.expect = chai.expect;
global.request = chai.request;

require('../api/index.spec.js');
require('../api/user.model.spec.js');


after((done)=> {
  mongoose.connection.close();
  done();
});