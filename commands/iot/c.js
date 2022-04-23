const axios = require('axios');
module.exports.execute = async function (json, msg, match, bot) {
    console.log('Executing c.js');
    const chatId = msg.chat.id;
    await axios.post(`${json.config.arduino}/c`, {
        RGBColor: match[1].trim(),
    });
    bot.sendMessage(chatId, "The color has been changed!");
};