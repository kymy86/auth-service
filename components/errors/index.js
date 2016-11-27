'use strict';

module.exports[404] =  (req,res) =>{
    const viewFilePath = '404';
    const statusCode = 404;
    const result = {
        status: statusCode
    };

    res.status(result.status);
    res.sender(viewFilePath, (err)=>{
        if(err){
            return res.json(result,result.status);
        }
        res.render(viewFilePath);
    });
};