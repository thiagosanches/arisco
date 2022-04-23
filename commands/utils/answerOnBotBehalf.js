module.exports.execute = function (json, msg, match, bot) {
    console.log("Executing answerOnBotBehalf.js");
    const message = match[1].split(':');
    bot.sendMessage(message[0], message[1]);
}