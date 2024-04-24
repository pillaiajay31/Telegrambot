const express = require('express');

const {handler} = require('./controller')
const PORT = 3302;
const app = express()
app.use(express.json());
app.post("*",async (req,res)=>{

    res.send("hello");
    res.send(await handler(req));

});
app.get("*",async (req,res)=>{

    res.send(await handler(req));
    res.send("hello");

});

app.listen(PORT,function(err){
    if(err) console.log(err);
    console.log("Listening on  "+PORT)
})