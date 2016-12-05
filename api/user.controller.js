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
    let userId = req.params.id;
    let oPwd = String(req.body.oPassword);
    let nPwd = String(req.body.nPassword);
    let name = String(req.body.name);
    
    User.findById(userId).exec().then((user)=>{
        if(user.authenticate(oPwd)){
            user.password=nPwd;
            user.name = name.length!==0 ? name : user.name;
            return user.save().then(()=>{
                res.status(200).end();
            }).catch((err)=>next(err));
        }else{
            return res.status(403).json({"message":"error"});
        }
    });

};

export function remove(req,res,next){
    let userId = req.params.id;
    User.findByIdAndRemove(userId).exec().then(()=>{
        return res.status(200).json({"message":"ok"});
    }).catch((err)=>next(err));
};

export function show(req,res,next){
    let userId = req.params.id;
    User.findById(userId).exec().then((user)=>{
        if(!user){
            return res.status(404).json({"message":"user not found"});
        }
        return res.status(200).json(user.profile);
    }).catch((err)=>next(err));
};
