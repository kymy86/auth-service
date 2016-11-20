'use strict'

import path from 'path';
var dotEnvPath = path.resolve(__dirname+'/../.env');
require('dotenv').config({path: dotEnvPath});
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import mongoose from 'mongoose';
import User from '../api/user.model';

chai.use(chaiAsPromised);
var user;
var expect = chai.expect;
var genUser = function () {
    user = new User({
        email: 'test@test.com',
        password: 'test',
        name: 'test name'
    });
    return user;
};

// when the test-suite starts, connect to mongo db
before(function(done){
    mongoose.connect(
        `mongodb://${process.env.MONGODB_ADDR}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`,
        {user: process.env.MONGODB_USER,pass: process.env.MONGODB_PASS}
    );
    done();
});

//after the test-suite ends, close the connection
after(function(done){
    mongoose.connection.close();
    done();
});

//before each test unit, generate a user
   beforeEach(function(done){
        genUser();
        done();
    });

//after each test unit, remove the test user
    afterEach(function(done){
        User.remove({email:'test@test.com'});
        done();
    });


describe('Basic User Model tests', function () {

    it('should exist only the seed user',function(done){
        User.find({},function(err,result){
            expect(result).to.have.length(1);
            done();
        });
    });

    it('should not save an existing user',function(done){
        user.save(function(err,res){
            var newUser = genUser();
            expect(newUser.save()).to.be.rejected;
            done();
        });
    });

});


describe("Email",function(){

    it("email address cannot be blank",function(done){
        user.email="";
        expect(user.save()).to.be.rejected;
        done();
    });

     it("email address cannot be null",function(done){
        user.email=null;
        expect(user.save()).to.be.rejected;
        done();
    });

      it("email address cannot be undefined",function(done){
        user.email=undefined;
        expect(user.save()).to.be.rejected;
        done();
    });

});


describe('password',function(){

    it("should fail if password is blank",function(done){
        user.password="";
        expect(user.save()).to.be.rejected;
        done();
    });

    it("should fail if password is null",function(done){
        user.password=null;
        expect(user.save()).to.be.rejected;
        done();
    });

    it("should fail if password is undefined",function(done){
        user.password=undefined;
        expect(user.save()).to.be.rejected;
        done();
    });

    it("should authenticate if user is valid",function(done){
        expect(user.authenticate('test')).to.be.true;
        done();
    });

    it("should not authenticate if user is invalid",function(done){
        expect(user.authenticate('foobar')).to.not.be.true;
        done();
    });

    it('should remain the same hash unless the password is updated',function(done){
        user.name="Foo bar";
        user.save(function(err,res){
            expect(user.authenticate('test')).to.be.true;
            done();
        });
    });

});
