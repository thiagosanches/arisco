module.exports.execute = function (match, chatId, bot) {
    console.log('Executing getWhatsAppDirectLink.js');
    const INDEX_COMMAND = 1;
    const number = match[INDEX_COMMAND].trim();
    bot.sendMessage(chatId, `https://api.whatsapp.com/send?phone=55${number}`);
};