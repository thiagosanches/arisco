const axios = require('axios');

module.exports.execute = async function (json, chatId, bot) {
    console.log('Executing t.js');
    const temperature = await axios.get(`${json.config.arduinoTemperature}`, {
        responseType: 'application/json'
    })
    bot.sendMessage(chatId, `${temperature.data.temperature} °C`);
};
