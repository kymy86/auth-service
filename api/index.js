'use strict';  

import {Router} from 'express';
import * as controller from './user.controller';

const router = new Router();

router.get('/',controller.honeypot);
router.get('/users',controller.index);

module.exports = router