

const TOKEN = process.env.TELEGRAM_TOKEN || '';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    host: '127.0.0.1',
    // Just use 443 directly
    port: 4444
  }
};
// You can use 'now alias <your deployment url> <custom url>' to assign fixed
// domain.
// See: https://zeit.co/blog/now-alias
// Or just use NOW_URL to get deployment url from env.
const url = 'YOUR_DOMAIN_ALIAS' || process.env.NOW_URL;
const bot = new TelegramBot(TOKEN, options);


// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);


// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive on Zeit Now!');
});
