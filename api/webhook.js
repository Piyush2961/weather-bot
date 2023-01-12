process.env.NTBA_FIX_319 = 'test';

const TelegramBot = require('node-telegram-bot-api');
// const axios = require('axios');


const  token = "5813477685:AAHrLpx1hVjepNcRzhQfOQaIYHPwss59J6w";
// const appID = "6f48dbd9fdabe835716e7799ce8541b6";

module.exports = async (request, response) => {
    try {
        // const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

        const bot = new TelegramBot(token, {
            polling: true,
          });
          

        // Retrieve the POST request body that gets sent from Telegram
        const { body } = request;

        // Ensure that this is a message being sent
        if (body.message) {
            // Retrieve the ID for this chat
            // and the text that the user sent
            const { chat: { id }, text } = body.message;

            // Create a message to send back
            // We can use Markdown inside this
            const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

            // Send our new message back in Markdown and
            // wait for the request to finish
            await bot.sendMessage(id, message, {parse_mode: 'Markdown'});
        }
    }
    catch(error) {
        // If there was an error sending our message then we 
        // can log it into the Vercel console
        console.error('Error sending message');
        console.log(error.toString());
    }
    
    // Acknowledge the message with Telegram
    // by sending a 200 HTTP status code
    // The message here doesn't matter.
    response.send('OK');
};