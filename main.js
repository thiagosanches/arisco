const TelegramBot = require('node-telegram-bot-api');
const json = require('./config.json');
const selfie = require('./commands/fun/selfie');
const message = require('./commands/default/message');
const getWhatsAppDirectLink = require('./commands/utils/getWhatsAppDirectLink');
const getOnlyNumbersFromText = require('./commands/utils/getOnlyNumbersFromText');
const answerOnBotBehalf = require('./commands/utils/answerOnBotBehalf');
const getPdfFromUrl = require('./commands/utils/getPdfFromUrl');
const p = require('./commands/iot/p');
const c = require('./commands/iot/c');
const m = require('./commands/iot/m');
const t = require('./commands/iot/t');
const r = require('./commands/raspberry/r');
const bot = new TelegramBot(json.authorizationToken, { polling: true });

/*DEFAULT*/
bot.on('message', (msg) => { message.execute(msg, json, bot) });

/*RASPBERRY*/
bot.onText(/\/r (.+)/, (msg, match) => { r.execute(json, msg, match, bot) });

/*FUN*/
bot.onText(/\/selfie/, (msg) => { selfie.execute(json, msg.chat.id, bot) });

/*UTILS*/
bot.onText(/\/t (.+)/gm, (msg) => { getOnlyNumbersFromText.execute(msg, msg.chat.id, bot) });
bot.onText(/\/w (.+)/gm, (msg, match) => { getWhatsAppDirectLink.execute(match, msg.chat.id, bot) });
bot.onText(/\/a m=(.+)/gm, (msg, match) => { answerOnBotBehalf.execute(json, msg, match, bot) });
bot.onText(/\/pdf (.+)/gm, (msg, match) => { getPdfFromUrl.execute(json, msg, match, bot) });

/*IOT*/
bot.onText(/\/iot p/, async (msg) => { p.execute(json, msg.chat.id, bot) });
bot.onText(/\/iot t/, async (msg) => { t.execute(json, msg.chat.id, bot) });
bot.onText(/\/iot c=(.+)/, async (msg, match) => { c.execute(json, msg, match, bot) });
bot.onText(/\/iot m=(.+)/, async (msg, match) => { m.execute(json, msg, match, bot) });
