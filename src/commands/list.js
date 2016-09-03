'use strict';

var pokedex = require('../pokedex');

/**
 * List command
 * @module command/list
 */
module.exports = {

    /** Command name */
    name: '/list',

    /** Command regex pattern */
    pattern: /\/list/,

    /** Command's description to be listed in /help */
    description: '/list - Lists Pokémon on your watchlist',

    /** Is the command listed in Telegram's command list? */
    list: true,

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
        var names = user.watchlist.map(function(number) {
            return pokedex.pokedex[number];
        });

        return 'Pokémon on your watchlist:\n\n' + names.join('\n');
    }

};
