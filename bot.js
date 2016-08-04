'use strict';

var TelegramBot = require('node-telegram-bot-api');

module.exports = function(config) {

    var bot = new TelegramBot(config.api_token, {polling: true});

    var pokemon = config.watchlist;

    // Add command
    // Accepts a space or comma-separated list of Pokemen to watch
    bot.onText(/\/add (.+)/, function(msg, match) {
        var toAdd = splitCommandArgs(match[1]);
        pokemon.push(toAdd);
        bot.sendMessage(msg.from.id, 'Added ' + toAdd.join(', ') + '!');
    });

    // Remove command
    // Accepts a space or comma-separated list of Pokemen to unwatch
    bot.onText(/\/remove (.+)/, function(msg, match) {
        var toRemove = splitCommandArgs(match[1]);

        pokemon = pokemon.filter(function(p) {
            return toRemove.indexOf(p) === -1;
        });

        bot.sendMessage(msg.from.id, printWatchlist());
    });

    // List command
    // Lists all the pokemen currently on the watchlist
    bot.onText(/\/list/, function(msg) {
        bot.sendMessage(msg.from.id, printWatchlist());
    });

    function splitCommandArgs(str) {
        return str.split(/[\s,]/).filter(function(value) {
            return value !== '';
        });
    }

    function printWatchlist() {
        return 'Pokémon on your watchlist:\n\n' + pokemon.join('\n');
    }

    return bot;
}

