'use strict';

import User from '../api/user.model';

User.find({}).remove(()=>{
    User.create({
        'name':'Kymy test',
        'password':'password',
        'role':'admin',
        'email':'kymy@test.com'
    }, ()=>{
        console.log(`finished populating users`);
    });
});