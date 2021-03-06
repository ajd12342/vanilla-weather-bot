'use strict';

const express = require('express');
const bodyParser= require('body-parser');
const config=require('./config');
const server = express();
const PORT= process.env.PORT || 3000;
const FBeamer=require('./fbeamer');
const sendResponse=require('./vanilla_bot');
const f=new FBeamer(config.fb);
server.get('/',(req,res) => f.registerHook(req,res));
server.post('/', bodyParser.json({
    verify: f.signatureVerifier.call(f),
}));
server.post('/',(req,res,next)=>{
    return f.incoming(req,res,async data=>{
        try{
            if(data && data.type==='text'){
                await sendResponse(f,data.sender,data.content);
            }
        }catch(e){
            console.log(e);
        }
    });
});
server.listen(PORT, () => console.log(`FBeamer Bot Service running on Port ${PORT}`));