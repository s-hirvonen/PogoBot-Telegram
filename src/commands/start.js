'use strict';

var pokedex = require('../pokedex'),
    logger = require('winston');

/**
 * Start command
 * @module command/start
 */
module.exports = {

    /** Command name */
    name: '/start',

    /** Command regex pattern */
    pattern: /\/start/,

    /** Command's description to be listed in /help */
    description: '/start - Start the bot',

    /** Is the command listed in Telegram's command list? */
    list: function(user) {
        return user.active === false;
    },

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
        if (created) {
            logger.info('Created new user with id %s', user.telegramId);
            // New users start with the default watchlist
            user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
        } else {
            user.active = true;
            user.save();
        }

        logger.info('User %s is now active', user.telegramId);
        return 'Bot activated! Type /stop to stop.';
    }

};
