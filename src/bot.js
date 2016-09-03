'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    logger = require('winston'),
    _ = require('lodash');

module.exports = function(config) {

    var bot = new TelegramBot(config.api_token, {polling: true});
    var commandManager = require('./commandManager')(config, bot);
    var pokemon = config.watchlist;
    var exports = {};

    var activeUsers = [];

    // Public interface
    // -----------------------------------------------------------------------

    exports.broadcast = function(message) {
        for (var i = 0; i < activeUsers.length; ++i) {
            bot.sendMessage(activeUsers[i], message);
        }
    };

    exports.sendPhotoNotification = function(users, photo, caption, coords) {
        _.forEach(users, function(user) {
            bot.sendPhoto(user, photo).then(function() {
            bot.sendMessage(user, caption, {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Get directions',
                        url: 'https://google.com/maps/dir//' + coords.join(',')
                    }]]
                }
            });
            });
        });
    }

    exports.sendNotification = function(users, caption, coords) {
        users.map(function(user) {
            bot.sendMessage(user, caption)
            .then(function() {
                return bot.sendLocation(user, coords[0], coords[1], {
                    disable_notification: true
                });
            });
        });
    };

    return exports;
}

