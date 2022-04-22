const TelegramBot = require('node-telegram-bot-api');
const json = require('./config.json');
const selfie = require('./commands/fun/selfie');
const message = require('./commands/default/message');
const getWhatsAppDirectLink = require('./commands/utils/getWhatsAppDirectLink');
const getOnlyNumbersFromText = require('./commands/utils/getOnlyNumbersFromText');
const p = require('./commands/iot/p');
const c = require('./commands/iot/c');
const m = require('./commands/iot/m');
const r = require('./commands/raspberry/r');
const arisco = new TelegramBot(json.authorizationToken, { polling: true });

/*DEFAULT*/
arisco.on('message', (msg) => { message.execute(msg, json, arisco) });

/*RASPBERRY*/
arisco.onText(/\/r (.+)/, (msg, match) => { r.execute(json, msg, match, arisco) });

/*FUN*/
arisco.onText(/\/selfie/, (msg) => { selfie.execute(json, msg.chat.id, arisco) });

/*UTILS*/
arisco.onText(/\/t (.+)/gm, (msg) => { getOnlyNumbersFromText.execute(msg, msg.chat.id, arisco) });
arisco.onText(/\/w (.+)/gm, (msg, match) => { getWhatsAppDirectLink.execute(match, msg.chat.id, arisco) });

/*IOT*/
arisco.onText(/\/iot p/, async (msg) => { p.execute(json, msg.chat.id, arisco) });
arisco.onText(/\/iot c=(.+)/, async (msg, match) => { c.execute(json, msg, match, arisco) });
arisco.onText(/\/iot m=(.+)/, async (msg, match) => { m.execute(json, msg, match, arisco) });
