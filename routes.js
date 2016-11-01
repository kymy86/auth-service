'use strict';

import errors from './components/errors';

export default function(app){

    app.use('/api',require('./api'));
    app.use('/auth',require('./auth').default);
    
    //all undefined assets or api routes should return a 404
    app.route('/:url(logs|components|config|node_modules|auth|api)/*')
        .get(errors[404]);
};