const exec = require('child_process').exec;
const execSpawn = require('child_process').spawn;
const INDEX_COMMAND = 1;
const DENIED_MESSAGE = 'You are not allowed to perform this command!';
const execute = (command, callback) => { exec(command, (error, stdout, stderr) => { callback(error, stdout, stderr); }); };
const executeSpawn = (command) => {
    let args = [];
    if (command.length > 1) {
        args = command.slice(1);
    }

    execSpawn(command[0], args, { detached: true, shell: true })
        .on('error', (err) => console.log(err));
};

module.exports.execute = async function (json, msg, match, bot) {
    const chatId = msg.chat.id,
        command = match[INDEX_COMMAND];

    if (!json.config.adminUsers.includes(chatId)) {
        bot.sendMessage(chatId, DENIED_MESSAGE);
        return;
    }

    const getCustomCommand = () => {
        for (var i = 0; i < json.config.customCommands.length; i++) {
            if (json.config.customCommands[i][command] !== undefined) {
                return json.config.customCommands[i];
            }
        }
        return null;
    }

    const customCommand = getCustomCommand(command);

    if (customCommand !== null) {
        if (customCommand.executeWithSpawn) {
            return executeSpawn(customCommand[command]);
        }

        return execute(customCommand[command], (error, stdout, stderr) =>
            bot.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' }));
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
        bot.sendMessage(chatId, DENIED_MESSAGE);
        return;
    }

    execute(command, (error, stdout, stderr) =>
        bot.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' }));
}