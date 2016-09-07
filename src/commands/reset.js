'use strict';

var pokedex = require('../pokedex'),
    config   = require('config.json')('./config.json');

/**
 * Reset command
 * @module command/reset
 */
module.exports = {

    /** Command name */
    name: '/reset',

    /** Command regex pattern */
    pattern: /\/reset/,

    /** Command's description to be listed in /help */
    description: '/reset - Reset your watchlist to the default.',

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
        user.watchlist = pokedex.getPokemonIdsByNames(config.watchlist);
        user.save();
    }

};
