const {handleMessage} = require("./Telegram")

async function handler(req,method)
{
    const {body} = req;
    if(body)
    {
        const messageObj = body.message?body.message:'';
        await handleMessage(messageObj);
    }
    return;
}
module.exports = {handler};