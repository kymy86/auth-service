'use strict';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

function localAuthenticate(User, email, password, done){
    User.findOne({email:email.toLowerCase()})
        .exec().then(user => {
            if(!user){return done(null,false,{message:'This email doesn\'t exist'});}
            
            user.authenticate(password,(authError,authenticated)=>{
                if(authError) {return done(authError)}
                if(!authenticated){
                    return done(null,false,{message:'This password is not correct'});
                }else{
                    return done(null,user);
                }
            });
        })
        .catch(err => done(err));
}

export function setup(User){
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    },(email,password,done)=>{
        return localAuthenticate(User,email,password,done);
    }));
}