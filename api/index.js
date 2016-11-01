'use strict';  

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../auth/auth.service';

const router = new Router();

router.get('/users',auth.hasRole('admin'),controller.index);
router.get('/',controller.honeypot);

module.exports = router