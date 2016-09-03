'use strict';

var pokedex = require('../pokedex'),
    logger = require('winston');

/**
 * Stop command
 * @module command/stop
 */
module.exports = {

    /** Command name */
    name: '/stop',

    /** Command regex pattern */
    pattern: /\/stop/,

    /** Command's description to be listed in /help */
    description: '/stop - Stop receiving notifications',

    /** Is the command listed in Telegram's command list? */
    list: function(user) {
        return user.active;
    },

    /**
     * Callback to execute when a user executes the command.
     * @param {Object} msg - The Telegram message object.
     * @param {Array}  match - The regex match result.
     * @param {Object} user - The user's stored Mongoose model.
     * @param {Boolean} created - Was the user created as a result of the command call?
     */
    callback: function(msg, match, user, created) {
        user.active = false;
        user.save();
        logger.info('User %s is now inactive', user.telegramId);
        return 'Bot stopped. /start again later!';
    }

};
