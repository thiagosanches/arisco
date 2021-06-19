const TelegramBot = require('node-telegram-bot-api'),
    json = require('./config.json'),
    exec = require('child_process').exec,
    execSpawn = require('child_process').spawn,
    axios = require('axios');

const arisco = new TelegramBot(json.authorizationToken, { polling: true }),
    INDEX_COMMAND = 1;

const http = require('http');

const getCustomCommand = (command) => {
    for (let i = 0; i < json.config.customCommands.length; i++) {
        if (json.config.customCommands[i][command] !== undefined) {
            return json.config.customCommands[i];
        }
    }
    return null;
};

const execute = (command, callback) => {
    exec(command, (error, stdout, stderr) => { callback(error, stdout, stderr); });
};

const executeSpawn = (command) => {
    let args = [];
    if (command.length > 1) {
        args = command.slice(1);
    }

    execSpawn(command[0], args, { detached: true, shell: true })
        .on('error', (err) => console.log(err));
};

arisco.onText(/\/r (.+)/, (msg, match) => {
    let chatId = msg.chat.id,
        command = match[INDEX_COMMAND];

    var getCustomCommand = () => {
        for (var i = 0; i < json.config.customCommands.length; i++) {
            if (json.config.customCommands[i][command] !== undefined) {
                return json.config.customCommands[i];
            }
        }
        return null;
    }

    var customCommand = getCustomCommand(command);

    if (customCommand !== null) {
        if (!json.config.adminUsers.includes(chatId)) {
            arisco.sendMessage(chatId, 'You are not allowed to perform this command!');
            return;
        }

        if (customCommand.executeWithSpawn) {
            return executeSpawn(customCommand[command]);
        }

        return execute(customCommand[command], (error, stdout, stderr) =>
            arisco.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' }));
    }

    const existDeniedCommands = (command) => {
        for (var i = 0; i < json.config.deniedCommands.length; i++) {
            if (command.indexOf(json.config.deniedCommands[i]) > -1)
                return true;
        }
        return false;
    }

    if (existDeniedCommands(command) &&
        !json.config.adminUsers.includes(chatId)) {
        arisco.sendMessage(chatId, 'You are not allowed to perform this command!');
        return;
    }

    execute(command, (error, stdout, stderr) =>
        arisco.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' }));

});

arisco.onText(/\/selfie/, (msg, match) => {
    const chatId = msg.chat.id;
    var index = Math.round(Math.random() * (json.config.selfies.length - 0) + 0);

    if (index < json.config.selfies.length)
        arisco.sendPhoto(chatId, json.config.selfies[index]);
});

arisco.on('message', (msg) => {
    console.log('Message received: ', msg);
});

arisco.onText(/\/t (.+)/gm, (msg, match) => {
    const chatId = msg.chat.id
    let text = msg.text.replace(/[^0-9a-zA-Z]+/g, '')
    let matches = text.match(/([0-9])+/g)
    if (matches) {
        matches.forEach(m => {
            arisco.sendMessage(chatId, m)
        })
    }
})

arisco.onText(/\/w (.+)/gm, (msg, match) => {
    const chatId = msg.chat.id
    const number = match[INDEX_COMMAND].trim();
    arisco.sendMessage(chatId, `https://api.whatsapp.com/send?phone=55${number}`)
})

arisco.onText(/\/iot (.+)/gm, (msg, match) => {
    const chatId = msg.chat.id
    const tokens = match[INDEX_COMMAND].split('=')

    if (tokens) {
        const command = tokens[0]
        if (command === 'm') {
            console.log("Sending a message...")
            axios.post(`${json.config.arduino}/${command}`, {
                message: tokens[1].trim(),
                sender: msg.from.first_name.trim()
            })
        }
        else if (command === 'c') {
            console.log("Changing the background color...")
            axios.post(`${json.config.arduino}/${command}`, {
                RGBColor: tokens[1].trim(),
            })
        }
        else {
            console.log(`Sending regular '${command}' command...`)
            http.get(`${json.config.arduino}/${command}`)
        }
    }
})

