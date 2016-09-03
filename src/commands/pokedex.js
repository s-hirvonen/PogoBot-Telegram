'use strict';

var pokedex = require('../pokedex'),
    _ = require('lodash');

/** Pokedex command
 * @module command/pokedex
 */
module.exports = {

    /** Command name */
    name: '/pokedex',

    /** Command regex pattern */
    pattern: /\/pokedex/,

    /** Command's description to be listed in /help */
    description: '/pokedex - List all known Pokémon',

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
        var names = [];
        _.forEach(pokedex.pokedex, function(name, number) {
            names.push(number + ') ' + name);
        });

        return 'All known Pokémon:\n\n' + names.join('\n');
    }

};
