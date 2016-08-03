'use strict';

var config = require('config.json')('./config.json'),
    TelegramBot = require('node-telegram-bot-api'),
    bot = new TelegramBot(config.api_token, {polling: true}),
    express = require('express'),
    server = express(),
    listener = require('./listener')(server, bot, config);

bot.on('message', function(msg) {
    console.log(msg);
    var photo = 'dog.png';
    bot.sendPhoto(msg.from.id, photo, {caption: 'YES THIS IS DOG'});
});
