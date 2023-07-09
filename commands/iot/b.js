// b ==> bulb
const axios = require('axios');
module.exports.execute = async function (json, msg, match, bot) {
    console.log('Executing b.js');
    
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "💡 Bulb blinking!");

    await axios.post(`${json.config.bulb}/json`, { on: false });
    await new Promise(resolve => setTimeout(resolve, 500));

    await axios.post(`${json.config.bulb}/json`, {
        seg: [{ col: [match[1].split(',')], fx: 2, sx: 255, ix: 255 }]
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    await axios.post(`${json.config.bulb}/json`, { on: true, bri: 255 });
    await new Promise(resolve => setTimeout(resolve, 500));

    await axios.post(`${json.config.bulb}/json`, { on: false });
};
