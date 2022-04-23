module.exports.execute = function (json, chatId, bot) {
    console.log('Executing selfie.js');
    var index = Math.round(Math.random() * (json.config.selfies.length - 0) + 0);
    if (index < json.config.selfies.length)
        bot.sendPhoto(chatId, json.config.selfies[index]);
}