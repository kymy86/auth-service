'use strict';

import User from './user.model';

export function honeypot(req,res){
    return res.status(200).json({'message':'Welcome to the authentication micro-service!'});
};

export function index(req,res){
    User.find({},'-salt -hashPassword',(err,users)=>{
        if(err) return res.send(500,err);
        return res.status(200).json(users);
    });
};

export function create(req,res){
    let user = new User(req.body);
        user.save().then(function(user){  
        return res.status(200).json({"message":"ok"});
    }).catch((err)=>{
        return res.status(500).json(err);
    });
};

export function update(req,res){

};

export function remove(req,res,next){};

export function show(req,res,next){
    let userId = req.params.id;
    User.findById(userId).exec().then((user)=>{
        if(!user){
            return res.status(404).json({"message":"user not found"});
        }
        /* @TODO return only certain atttributes*/
        return res.status(200).json(user);
    }).catch((err)=>next(err));
};
