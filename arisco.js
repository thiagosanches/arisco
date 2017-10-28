const TelegramBot = require('node-telegram-bot-api');
const json = require('./config.json');
var exec = require('child_process').exec;
var execSpawn = require('child_process').spawn;


const arisco = new TelegramBot(json.authorizationToken, { polling: true });
const INDEX_COMMAND = 1;

function execute(command, callback) {
    exec(command, function(error, stdout, stderr){ callback(error, stdout, stderr); });
}

function executeSpawn(command) {
	var args = [];
	if(command.length > 1)
		args = command.slice(1);

	execSpawn(command[0], args, { detached: true, shell: true })
		.on('error', (err) => console.log(err));
}

arisco.onText(/\/raspberry (.+)/, (msg, match) => {
	const chatId = msg.chat.id;
	const command = match[INDEX_COMMAND];

	var getCustomCommand = () => {
		for(var i = 0; i < json.config.customCommands.length; i++) {
			if(json.config.customCommands[i][command] !== undefined) {
				return json.config.customCommands[i];
			}
		}
		return null;
	}

	var customCommand = getCustomCommand();

	if(customCommand !== null) {
		if(!json.config.adminUsers.includes(chatId)) { 
			arisco.sendMessage(chatId, 'You are not allowed to perform this command!');
			return;
		}
		
		console.log('Executing custom command: ', customCommand);

		if(customCommand.executeWithSpawn) {
			console.log("executing: ", customCommand[command]);
			executeSpawn(customCommand[command]);
		}
		else
		{
			execute(customCommand[command], function(error, stdout, stderr){
				arisco.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' });
			});
		}
	}
	else {

		existDeniedCommands = (command) => {
			for(var i = 0; i < json.config.deniedCommands.length; i++){
				if(command.indexOf(json.config.deniedCommands[i]) > -1)
					return true;
			}
			return false;
		};

		if(existDeniedCommands(command) && 
			!json.config.adminUsers.includes(chatId)) {
			arisco.sendMessage(chatId, 'You are not allowed to perform this command!');
			return;
		}

		execute(command, function (error, stdout, stderr){
			arisco.sendMessage(chatId, '<code>' + stdout + stderr + '</code>', { parse_mode: 'HTML' });
		});

	}
});

arisco.onText(/\/selfie/, (msg, match) => {
	const chatId = msg.chat.id;
	var index = Math.round(Math.random() * (json.config.selfies.length - 0) + 0);

	if( index < json.config.selfies.length)
		arisco.sendPhoto(chatId, json.config.selfies[index]);
});

arisco.on('message', (msg) => {
	console.log('Message received: ', msg);
});
