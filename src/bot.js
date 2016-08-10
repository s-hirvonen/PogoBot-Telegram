'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    logger = require('winston'),
    _ = require('lodash'),
    fs = require('fs'),
    User = require('./user.js'),
    Pokedex = require('./pokedex');

module.exports = function(config) {

    var bot = new TelegramBot(config.api_token, {polling: true});
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

    exports.sendPhotoNotification = function(users, photo, caption) {
        _.forEach(users, function(user) {
            bot.sendPhoto(user, photo, {
                caption: caption
            });
        });
    };

    // -----------------------------------------------------------------------

    // Start command
    bot.onText(/\/start/, function(msg, match) {
        User.findOrCreate({ telegramId: msg.from.id }, function(err, user, created) {
            if (created) {
                logger.info('Created new user with id %s', user.telegramId);
                // New users start with the default watchlist
                user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
            }

            logger.info('User %s is now active', user.telegramId);
        });

        bot.sendMessage(msg.from.id, 'Bot activated! Type /stop to stop.');
    });

    // Stop command
    bot.onText(/\/stop/, function(msg, match) {
        User.findOne({ telegramId: msg.from.id }, function(err, user) {
            user.active = false;
            user.save();
            logger.info('User %s is now inactive', user.telegramId);
            bot.sendMessage(msg.from.id, 'Bot stopped. /start again later!');
        });
    });

    // Add command
    // Accepts a space or comma-separated list of Pokemen to watch
    bot.onText(/\/add (.+)/, function(msg, match) {
        User.findOne({ telegramId: msg.from.id }, function(err, user) {
            var toAdd = splitCommandArgs(match[1]);
            var toAddIds = Pokedex.getPokemonIdsByNames(toAdd);

            user.watchlist = user.watchlist.concat(toAddIds).sort(function(a, b) {
                return a - b;
            });
            user.save();
        });
    });

    // Remove command
    // Accepts a space or comma-separated list of Pokemen to unwatch
    bot.onText(/\/remove (.+)/, function(msg, match) {
        User.findOne({ telegramId: msg.from.id }, function(err, user) {
            var toRemove = splitCommandArgs(match[1]);
            var toRemoveIds = Pokedex.getPokemonIdsByNames(toRemove);

            user.watchlist = user.watchlist.filter(function(number) {
                return toRemoveIds.indexOf(number) === -1;
            });

            user.save();
        });
    });

    // List command
    // Lists all the pokemen currently on the watchlist
    bot.onText(/\/list/, function(msg) {
        User.findOne({ telegramId: msg.from.id }, function(err, user) {
            bot.sendMessage(msg.from.id, printWatchlist(user.watchlist));
        });
    });

    // Help command
    // Lists all the available commands
    bot.onText(/\/help/, function(msg) {
        bot.sendMessage(
            msg.from.id,
            'Hello! I am PogoBot, and alert you of nearby Pokémon!\n\n' +
            'The following commands are available to you:\n' +
            '/add name [name2]... - Add Pokémon to the watchlist.\n' +
            '/remove name [name2]... - Remove alerts from the specified Pokémon.\n' +
            '/list - Display your watchlist.\n' +
            '/help - Display this message'
        );
    });

    // Reset command
    // Resets the user's watchlist to the default list from config.json
    bot.onText(/\/reset/, function(msg) {
        logger.info('Watchlist reset request from %s', msg.from.id);

        User.findOne({ telegramId: msg.from.id }, function(err, user) {
            user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
            user.save();

            bot.sendMessage( msg.from.id, 'Watchlist reset complete!');
        });
    });

    function splitCommandArgs(str) {
        return str.split(/[\s,]/).filter(function(value) {
            return value !== '';
        });
    }

    function printWatchlist(list) {
        var names = list.map(function(number) {
            return Pokedex.pokedex[number];
        });

        return 'Pokémon on your watchlist:\n\n' + names.join('\n');
    }

    return exports;
}

