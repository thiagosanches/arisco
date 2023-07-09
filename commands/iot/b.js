// b ==> bulb
const axios = require('axios');
module.exports.execute = async function (json, msg, match, bot) {
    console.log('Executing b.js');
    const chatId = msg.chat.id;
    await axios.post(`${json.config.bulb}/json`, { on: false });
    await axios.post(`${json.config.bulb}/json`, {
        seg: [{ col: [[255, 255, 255]], fx: 2, sx: 255, ix: 255 }]
    });
    await axios.post(`${json.config.bulb}/json`, { on: true, bri: 255 });
    await axios.post(`${json.config.bulb}/json`, { on: false });
    bot.sendMessage(chatId, "💡 Bulb blinking!");
};
