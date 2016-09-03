'use strict';

var pokedex = require('../pokedex');

/**
 * Remove command
 * @module command/remove
 */
module.exports = {

    /** Command name */
    name: '/remove',

    /** Command regex pattern */
    pattern: /\/remove (.+)/,

    /** Command's description to be listed in /help */
    description: '/remove name [name]... - Removes Pokémon from the watchlist',

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
        var toRemoveIds = pokedex.getPokemonIdsFromArgumentString(match[1]);

        user.watchlist = user.watchlist.filter(function(number) {
            return toRemoveIds.indexOf(number) === -1;
        });

        user.save();
    }

};
