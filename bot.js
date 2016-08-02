'use strict';

var config = require('config.json')('./config.json'),
    TelegramBot = require('node-telegram-bot-api'),
    bot = new TelegramBot(config.api_token, {polling: true});

bot.on('message', function(msg) {
    console.log(msg);
    bot.sendMessage(msg.from.id, 'response');
});


