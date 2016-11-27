'use strict';

import {Router} from 'express';
import User from '../api/user.model';
import {signToken} from './auth.service';
import passport from 'passport';

require('./passport').setup(User);

var router = new Router();

router.post('/',(req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        var error = err || info;
        if(error){ return res.status(401).json(error);}
        if(!user){ return res.status(400).json({message:'Something went wrong, please try again'});}

        var token = signToken(user._id, user.role);
        res.json({token});
    })(req,res,next);
});

export default router;