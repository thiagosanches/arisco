const axios = require('axios');
const fs = require('fs');

module.exports.execute = async function (json, chatId, bot) {
    console.log('Executing p.js');
    const picture = await axios.get(`${json.config.esp32cam}/jpg`, {
        responseType: 'stream'
    })
    await picture.data.pipe(fs.createWriteStream("./picture.jpg"));
    await new Promise(resolve => setTimeout(resolve, 7000));
    bot.sendPhoto(chatId, "./picture.jpg");
};
