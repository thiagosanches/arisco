module.exports.execute = function (msg, json, bot) {
    console.log('Message received: ', msg);
    if (!json.config.adminUsers.includes(msg.from.id)) {
        bot.sendMessage(json.config.iotGroup, `\[${msg.from.id}\] ${msg.from.first_name} sent:\`\`\`${msg.text}\`\`\``, { parse_mode: "markdown" });
    }

    /*TODO*/
    /*if (msg.web_app_data) {
        const chatId = msg.chat.id;
        console.log("WEB APP IDENTIFIED!!!");
        arisco.sendMessage(chatId, "The message that I got: " + msg.web_app_data.data);
    }*/
}