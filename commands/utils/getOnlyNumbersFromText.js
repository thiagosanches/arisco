module.exports.execute = function (msg, chatId, bot) {
    console.log('Executing getOnlyNumbersFromText.js');
    const text = msg.text.replace(/[^0-9a-zA-Z]+/g, '');
    const matches = text.match(/([0-9])+/g);
    if (matches) {
        matches.forEach(m => {
            bot.sendMessage(chatId, m);
        });
    }
};
