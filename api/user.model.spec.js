'use strict'

import User from '../api/user.model';

let user;
const genUser = () => {
    user = new User({
        email: 'test@test.com',
        password: 'test',
        name: 'test name'
    });
    return user;
};

describe('Basic User Model tests', () => {

    before((done) => {
        User.remove().exec();
        done();
    });

    beforeEach((done) => {
        genUser();
        done();
    });

    //after each test unit, remove the test user
    afterEach((done) => {
        User.remove().exec();
        done();
    });

    it('should begin with no user', (done) => {
        User.find({}, (err, result) => {
            expect(result).to.have.length(0);
            done();
        });
    });

    it('should not save an existing user', (done) => {
        user.save((err, res) => {
            let newUser = genUser();
            expect(newUser.save()).to.be.rejected;
            done();
        });
    });

    describe("Email", () => {

        it("email address cannot be blank", (done) => {
            user.email = "";
            expect(user.save()).to.be.rejected;
            done();
        });

        it("email address cannot be null", (done) => {
            user.email = null;
            expect(user.save()).to.be.rejected;
            done();
        });

        it("email address cannot be undefined", (done) => {
            user.email = undefined;
            expect(user.save()).to.be.rejected;
            done();
        });

    });

    describe('password', () => {

        it("should fail if password is blank", (done) => {
            user.password = "";
            expect(user.save()).to.be.rejected;
            done();
        });

        it("should fail if password is null", (done) => {
            user.password = null;
            expect(user.save()).to.be.rejected;
            done();
        });

        it("should fail if password is undefined", (done) => {
            user.password = undefined;
            expect(user.save()).to.be.rejected;
            done();
        });

        it("should authenticate if user is valid", (done) => {
            expect(user.authenticate('test')).to.be.true;
            done();
        });

        it("should not authenticate if user is invalid", (done) => {
            expect(user.authenticate('foobar')).to.not.be.true;
            done();
        });

        it('should remain the same hash unless the password is updated', (done) => {
            user.name = "Foo bar";
            user.save((err, res) => {
                expect(user.authenticate('test')).to.be.true;
                done();
            });
        });

    });


});