'use strict';

import User from '../api/user.model';

User.find({}).remove(function(){
    User.create({
        'name':'Kymy test',
        'password':'password',
        'role':'admin',
        'email':'kymy@test.com'
    }, function(){
        console.log(`finished populating users`);
    });
});