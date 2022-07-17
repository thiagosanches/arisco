const puppeteer = require('puppeteer');

module.exports.execute = async function (json, msg, match, bot) {
    const chatId = msg.chat.id;
    console.log('Executing getPdfFromUrl.js');
    console.log(`Url: ${match[1]}`);
    console.log(`chatId: ${chatId}`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(match[1]);

    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    console.log(pdf);
    bot.sendDocument(chatId, pdf);
};
