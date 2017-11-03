const TelegramBot = require('node-telegram-bot-api'),
    json = require('./config.json'),
    exec = require('child_process').exec,
    execSpawn = require('child_process').spawn;

const arisco = new TelegramBot(json.authorizationToken, { polling: true }),
    INDEX_COMMAND = 1;

const getCustomCommand = () => {
    for (let i = 0; i < json.config.customCommands.length; i++) {
        if (json.config.customCommands[i]['command'] !== undefined) {
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

arisco.onText(/\/raspberry (.+)/, (msg, match) => {
    let chatId = msg.chat.id,
        command = match[INDEX_COMMAND];

	var getCustomCommand = () => {
		for(var i = 0; i < json.config.customCommands.length; i++) {
			if(json.config.customCommands[i][command] !== undefined) {
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