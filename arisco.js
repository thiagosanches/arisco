const TelegramBot = require('node-telegram-bot-api'),
    json = require('./config.json'),
    exec = require('child_process').exec,
    execSpawn = require('child_process').spawn,
    axios = require('axios');
fs = require('fs')
const ngrok = require('ngrok');

const arisco = new TelegramBot(json.authorizationToken, { polling: true }),
    INDEX_COMMAND = 1;

const http = require('http');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

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

    if (!json.config.adminUsers.includes(chatId)) {
        arisco.sendMessage(chatId, 'You are not allowed to perform this command!');
        return;
    }

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
    if (!json.config.adminUsers.includes(msg.from.id)) {
        arisco.sendMessage(json.config.iotGroup, `\[${msg.from.id}\] ${msg.from.first_name} sent:\`\`\`${msg.text}\`\`\``, { parse_mode: "markdown" })
    }
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

arisco.onText(/\/iot (.+)/gm, async (msg, match) => {
    const chatId = msg.chat.id
    const tokens = match[INDEX_COMMAND].split('=')

    if (tokens) {
        const command = tokens[0]
        if (command === 'm') {
            console.log("Sending a message...")

            let myMessage = tokens[1].trim().replace(/[^a-zA-Z0-9!?,. ]/gi, '')
            const totalMessage = `${msg.from.first_name.toLowerCase().substring(0, 5).trim()}:${myMessage}`
            const TOTAL_LIMIT_CHARS = 25
            const BATCHES_NUMBER = Math.ceil(totalMessage.length / TOTAL_LIMIT_CHARS)

            for (let i = 0; i < BATCHES_NUMBER; i++) {
                const limitedMessage = totalMessage.substring(i * TOTAL_LIMIT_CHARS, (i + 1) * TOTAL_LIMIT_CHARS)
                console.log(`Batch ${i}: '${limitedMessage}'`)
                await axios.post(`${json.config.arduino}/${command}`, {
                    message: limitedMessage.trim()
                })
                //TODO: it's not elegant, but needed to do that til implement a mutex on arduino logic,
                //to avoid serial communication issues.
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        else if (command === 'c') {
            console.log("Changing the background color...")
            await axios.post(`${json.config.arduino}/${command}`, {
                RGBColor: tokens[1].trim(),
            })
        }
        else if (command === 'p') {
            console.log("Taking a picture...")
            const picture = await axios.get(`${json.config.esp32cam}/cam.mjpeg`, { //picture
                responseType: 'stream'
            })
            await picture.data.pipe(fs.createWriteStream("./picture.jpg"));
            await new Promise(resolve => setTimeout(resolve, 7000));
            arisco.sendPhoto(chatId, "./picture.jpg");
        }
        else {
            console.log(`Sending regular '${command}' command...`)
            http.get(`${json.config.arduino}/${command}`)
        }
    }
})

arisco.onText(/\/tunnelOn/gm, async(msg, match)=>{
    const url = await ngrok.connect();
    arisco.sendMessage(json.config.iotGroup, `Here it goes your url: ${url}`);
})

arisco.onText(/\/tunnelOff/gm, async(msg, match)=>{
    console.log(await ngrok.disconnect())
    console.log(await ngrok.kill())
    arisco.sendMessage(json.config.iotGroup, `Tunnel is gone!`);
})
