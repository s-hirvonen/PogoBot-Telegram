'use strict';

var pokedex = require('../pokedex');

/**
 * Add command
 * @module command/add
 */
module.exports = {

    /** Command name */
    name: '/add',

    /** Command regex pattern */
    pattern: /\/add (.+)/,

    /** Command's description to be listed in /help */
    description: '/add name [name]... - Adds Pokémon to the watchlist',

    /** Is the command listed in Telegram's command list? */
    list: false,

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
        var toAddIds = pokedex.getPokemonIdsFromArgumentString(match[1]).filter(function(item) {
            return user.watchlist.indexOf(item) === -1;
        });

        user.watchlist = user.watchlist.concat(toAddIds).sort(function(a, b) {
            return a - b;
        });
        user.save();
    }

};
