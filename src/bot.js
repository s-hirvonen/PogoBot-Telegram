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
    };

    // -----------------------------------------------------------------------
    bot.onCommand = function(pattern, callback) {
        bot.onText(pattern, function(msg, match) {
            User.findOrCreate({ telegramId: msg.from.id }, function(err, user, created) {
                if (err) {
                    logger.error(err);
                    return;
                }
                callback(msg, match, user, created);
            });
        });
    };

    // Start command
    bot.onCommand(/\/start/, function(msg, match, user, created) {
        if (created) {
            logger.info('Created new user with id %s', user.telegramId);
            // New users start with the default watchlist
            user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
        } else {
            user.active = true;
            user.save();
        }

        logger.info('User %s is now active', user.telegramId);
        bot.sendMessage(msg.from.id, 'Bot activated! Type /stop to stop.');
    });

    // Stop command
    bot.onCommand(/\/stop/, function(msg, match, user, created) {
        user.active = false;
        user.save();
        logger.info('User %s is now inactive', user.telegramId);
        bot.sendMessage(msg.from.id, 'Bot stopped. /start again later!');
    });

    // Add command
    // Accepts a space or comma-separated list of Pokemen to watch
    bot.onCommand(/\/add (.+)/, function(msg, match, user, created) {
        var toAddIds = getPokemonFromArguments(match[1]).filter(function(item) {
            return user.watchlist.indexOf(item) === -1;
        });

        user.watchlist = user.watchlist.concat(toAddIds).sort(function(a, b) {
            return a - b;
        });
        user.save();
    });

    // Remove command
    // Accepts a space or comma-separated list of Pokemen to unwatch
    bot.onCommand(/\/remove (.+)/, function(msg, match, user, created) {
        var toRemoveIds = getPokemonFromArguments(match[1]);

        user.watchlist = user.watchlist.filter(function(number) {
            return toRemoveIds.indexOf(number) === -1;
        });

        user.save();
    });

    // List command
    // Lists all the pokémon currently on the watchlist
    bot.onCommand(/\/list/, function(msg, match, user, created) {
        bot.sendMessage(msg.from.id, printWatchlist(user.watchlist));
    });

    // Pokedex command
    // Lists all known pokémon
    bot.onCommand(/\/pokedex/, function(msg, match, user, created) {
        bot.sendMessage(msg.from.id, printPokemonList(Pokedex.pokedex));
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
            '/pokedex - List all known Pokémon.\n' +
            '/reset - Reset your watchlist to the default.\n' +
            '/help - Display this message'
        );
    });

    // Reset command
    // Resets the user's watchlist to the default list from config.json
    bot.onCommand(/\/reset/, function(msg, match, user, created) {
        logger.info('Watchlist reset request from %s', msg.from.id);
        user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
        user.save();
        bot.sendMessage( msg.from.id, 'Watchlist reset complete!');
    });

    function getPokemonFromArguments(str) {
        var args = str.split(/[\s,]/).filter(function(value) {
            return value !== '';
        });

        var ids = [];

        args.map(function(pokemon) {
            if (!isNaN(Number(pokemon))) {
                // Pokedex number passed
                ids.push(Number(pokemon));
            } else {
                // Pokémon name passed
                var id = Number(Pokedex.getPokemonIdByName(pokemon));
                if (id !== NaN) ids.push(id);
            }
        });

        return ids;
    }

    function printWatchlist(list) {
        var names = list.map(function(number) {
            return Pokedex.pokedex[number];
        });

        return 'Pokémon on your watchlist:\n\n' + names.join('\n');
    }

    function printPokemonList(list) {
        var names = [];
        _.forEach(list, function(name, number) {
            names.push(number + ') ' + name);
        });

        return 'All known Pokémon:\n\n' + names.join('\n');
    }

    return exports;
}

