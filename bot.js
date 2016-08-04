'use strict';

var TelegramBot = require('node-telegram-bot-api');

module.exports = function(config) {

    var bot = new TelegramBot(config.api_token, {polling: true});

    var pokemon = ['Bulbasaur', 'Charmander', 'Pikachu'];

    bot.onText(/\/add (.+)/, function(msg, match) {
        var toAdd = splitCommandArgs(match[1]);
        pokemon.push(toAdd);
        bot.sendMessage(msg.from.id, 'Added ' + toAdd.join(', ') + '!');
    });

    bot.onText(/\/remove (.+)/, function(msg, match) {
        var toRemove = splitCommandArgs(match[1]);

        pokemon = pokemon.filter(function(p) {
            return toRemove.indexOf(p) === -1;
        });

        bot.sendMessage(msg.from.id, printWatchlist());
    });

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

