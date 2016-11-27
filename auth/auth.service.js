'use strict';

import config from '../config/environments';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user.model';

const validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated(){
    return compose()
    //Validate JWT
    .use((req,res,next)=>{
        if(req.query && req.query.hasOwnProperty('access_token')){
            req.headers.authorization = `Bearer ${req.query.access_token}`;
        }
        if(!req.headers.authorization)
            return res.status(403).send('Forbidden');

        validateJwt(req,res,next);
    })
    //Attach User to request
    .use((req,res,next)=>{
        User.findById(req.user._id).exec().then(user =>{
            if(!user){return res.status(401).end();}
            req.user = user;
            next();
        }).catch(err => next(err));
    }); 
}

/**
 * Check if user has the required minimun role.
 */
export function hasRole(roleRequired){
    if(!roleRequired){throw new Error('Required role needs to be set');}

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req,res,next){
            if(config.roles.indexOf(req.user.role)>=config.roles.indexOf(roleRequired)){
                return next();
            }else{
                return res.status(403).send('Forbidden');
            }
        })
}

/**
 * Return a jwt token signed by the app secret
 */
export function signToken(id, role){
    return jwt.sign({_id:id, role:role},config.secrets.session,{
        expiresIn: 60*60*5
    })
}
