const axios = require('axios');
module.exports.execute = async function (json, msg, match, bot) {
    console.log('Executing m.js');
    const myMessage = match[1].trim().replace(/[^a-zA-Z0-9!?,. ]/gi, '')
    const totalMessage = `${msg.from.first_name.toLowerCase().substring(0, 5).trim()}:${myMessage}`
    const TOTAL_LIMIT_CHARS = 25
    const BATCHES_NUMBER = Math.ceil(totalMessage.length / TOTAL_LIMIT_CHARS)

    for (let i = 0; i < BATCHES_NUMBER; i++) {
        const limitedMessage = totalMessage.substring(i * TOTAL_LIMIT_CHARS, (i + 1) * TOTAL_LIMIT_CHARS)
        console.log(`Batch ${i}: '${limitedMessage}'`)
        await axios.post(`${json.config.arduino}/m`, {
            message: limitedMessage.trim()
        })
        //TODO: it's not elegant, but needed to do that til implement a mutex on arduino logic,
        //to avoid serial communication issues.
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
}