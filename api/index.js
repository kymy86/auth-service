'use strict';  

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../auth/auth.service';

const router = new Router();

router.get('/users',auth.hasRole('admin'),controller.index);
router.post('/',auth.hasRole('admin'),controller.create);
router.put('/:id',auth.isAuthenticated(),controller.update);
router.delete('/:id',auth.hasRole('admin'),controller.remove);
router.get('/me',auth.isAuthenticated(),controller.me);
router.get('/',controller.honeypot);

module.exports = router