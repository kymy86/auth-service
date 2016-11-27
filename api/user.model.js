'use strict';

import crypto from 'crypto';
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';

var UserSchema = new Schema({
    name: String,
    email: {type:String, lowercase:true,required:true},
    hashPassword: {type:String, required:true},
    role:{type:String, default:'user'},
    salt: String,
    createdAt: Date,
    lastLogin: Date
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set((password)=>{
        this._password = password;
        this.salt = this.makeSalt();
        this.hashPassword = this.encryptPassword(this._password);
    })
    .get(()=>{ 
        return this._password;
    });

/**
 * Validations
 */
UserSchema.path('email')
    .validate((email)=>{
        return email.length;
    }, 'Email cannot be blank');

UserSchema.path('hashPassword')
    .validate((password)=>{
        return password.length;
    }, 'password cannot be blank');

UserSchema.path('email')
    .validate((value,respond)=>{
        return this.constructor.findOne({email:value}).exec()
            .then(user => {
                if(user){
                    if(this.id === user.id){ return respond(true);}
                    return respond(false);
                }
                return respond(true);
            })
            .catch((err)=>{ throw err});
    }, 'The email is already in used');

var validatePresenceOf = (value)=>{
    return value && value.length;
}

/**
 * Pre-save hook
 */
UserSchema
    .pre('save',(next)=>{
        if(this.isNew){
            if(!validatePresenceOf(this.hashPassword))
                next(new Error('Invalid password'));
            else{
                this.createdAt = new Date();
                next();
            }
        }
        next();
    });

UserSchema.methods = {

    /**
     * authenticate by checking if the password are the same
     */
    authenticate: (plainText,callback)=>{
        if(!callback){
            return this.hashPassword === this.encryptPassword(plainText);
        }
        this.encryptPassword(plainText, (err,pwdGen)=>{
            if(err){
                return callback(err);
            }
            if(this.hashPassword === pwdGen){
                return callback(null,true);
            }else{
                return callback(null,false);
            }
        });

    },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
    makeSalt: ()=>{
        return crypto.randomBytes(16).toString('base64');
    },
    
  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
    encryptPassword: (password,callback)=>{
        if(!password || !this.salt){
            if(!callback)
                return '';
            else
                return callback('Missing password or salt');
        }
        var salt = new Buffer(this.salt,'base64');

        if(!callback){
            return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
        }

        return crypto.pbkdf2(password, salt, 10000, 64, (err,key)=>{
            if(err){
                return callback(err);
            }else{
                return callback(null, key.toString('base64'));
            }
        });

    }

};

export default mongoose.model('User',UserSchema)