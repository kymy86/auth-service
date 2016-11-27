'use strict';

import User from './user.model';

export function honeypot(req,res){
    return res.status(200).json({'message':'Welcome to the authentication micro-service!'});
};

export function index(req,res){
    User.find({},'-salt -hashPassword',(err,users)=>{
        if(err) return res.send(500,err);
        res.status(200).json(users);
    });
};
