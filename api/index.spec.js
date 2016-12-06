'use strict';

import User from './user.model';
const server = require('../index.js');

describe('User API',() =>{
let userAdmin;
let userUser;

    before((done)=>{
        User.remove().then(()=>{
            userAdmin = new User({
                name: 'test admin',
                email: 'admin@test.com',
                password: 'password',
                role:'admin'
            });
            userAdmin.save();
            userUser = new User({
                name: 'test user',
                email: 'user@test.com',
                password: 'password',
            });
            userUser.save();
            done();
        });
    });

    after((done)=>{
        User.remove().exec();
        done();
    });

 describe('Test cases as ADMIN',()=>{
     let token;

     before((done)=>{
         request(server)
            .post('/auth')
            .send({
                email:'admin@test.com',
                password:'password'
            })
            .end((err,res)=>{
                expect(res).to.have.status(200)
                expect(res).to.be.a('object');
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            })
     });

    it('ADMIN GET /api/users',(done)=>{
        request(server)
            .get('/api/users')
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
    });

    it('ADMIN POST /api',(done)=>{
        request(server)
            .post('/api')
            .set('Authorization','Bearer ' + token)
            .send({
                name:'test2',
                email:'test22@test.com',
                password:'testpwd'
            })
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

     it('ADMIN POST /api without email',(done)=>{
        request(server)
            .post('/api')
            .set('Authorization','Bearer ' + token)
            .send({
                name:'test2',
                password:'testpwd'
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(500);
                done();
            });
    });

      it('ADMIN POST /api without password',(done)=>{
        request(server)
            .post('/api')
            .set('Authorization','Bearer ' + token)
            .send({
                name:'test2',
                email:'test22@test.com',
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(500);
                done();
            });
    });

    it('ADMIN POST /api without password & email',(done)=>{
        request(server)
            .post('/api')
            .set('Authorization','Bearer ' + token)
            .send({
                name:'test2',
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(500);
                done();
            });
    });

    it('ADMIN DELETE /api',(done)=>{
        let idAdmin = userAdmin._id.toString(); 
        request(server)
            .delete(`/api/${idAdmin}`)
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });



 });

 describe('Test cases as USER',()=>{
     let token;

     before((done)=>{
         request(server)
            .post('/auth')
            .send({
                email:'user@test.com',
                password:'password'
            })
            .end((err,res)=>{
                expect(res).to.have.status(200)
                expect(res).to.be.a('object');
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            });
     });

     it('GET /api/users as USER',(done)=>{
        request(server)
            .get('/api/users')
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(res).to.have.status(403);
                done();
            })
     });

     it('GET /api/me as USER',(done)=>{
        request(server)
            .get('/api/me')
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(res).to.have.status(200);
                expect('Content-Type',/json/);
                expect(res.body._id.toString()).to.equal(userUser._id.toString());
                done();
            })
     });

     it('USER DELETE /api',(done)=>{
        let idUser = userUser._id.toString(); 
        request(server)
            .delete(`/api/${idUser}`)
            .set('Authorization','Bearer ' + token)
            .end((err,res)=>{
                expect(res).to.have.status(403);
                expect(err).not.to.be.null;
                done();
            });
    });

      it('USER POST /api',(done)=>{
        request(server)
            .post('/api')
            .set('Authorization','Bearer ' + token)
            .send({
                name:'test2',
                email:'test22@test.com',
                password:'testpwd'
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });

    it('USER UPDATE /api/:id with right data',(done)=>{
        let idUser = userUser._id.toString(); 
        request(server)
            .put(`/api/${idUser}`)
            .set('Authorization','Bearer ' + token)
            .send({
                oPassword:'password',
                nPassword:'password2',
                name: 'test user 2'
            })
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('USER UPDATE /api/:id without oPassword',(done)=>{
        let idUser = userUser._id.toString(); 
        request(server)
            .put(`/api/${idUser}`)
            .set('Authorization','Bearer ' + token)
            .send({
                nPassword:'password2'
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });

     it('USER UPDATE /api/:id without nPassword',(done)=>{
        let idUser = userUser._id.toString(); 
        request(server)
            .put(`/api/${idUser}`)
            .set('Authorization','Bearer ' + token)
            .send({
                oPassword:'password',
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });

      it('USER UPDATE /api/:id with wrong password',(done)=>{
        let idUser = userUser._id.toString(); 
        request(server)
            .put(`/api/${idUser}`)
            .set('Authorization','Bearer ' + token)
            .send({
                oPassword:'password3232',
                nPassword:'password2'
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(403);
                done();
            });
    });

     it('USER UPDATE /api/:id try updating different user',(done)=>{
        let idAdmin = userAdmin._id.toString(); 
        request(server)
            .put(`/api/${idAdmin}`)
            .set('Authorization','Bearer ' + token)
            .send({
                oPassword:'password3232',
                nPassword:'password2'
            })
            .end((err,res)=>{
                expect(err).not.to.be.null;
                expect(res).to.have.status(500);
                done();
            });
    });


 });
});