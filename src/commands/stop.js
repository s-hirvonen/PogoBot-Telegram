'use strict';

var pokedex = require('../pokedex'),
    logger = require('winston');

module.exports = {

    pattern: /\/stop/,

    description: '/stop - Stop receiving notifications',

    list: false,

    callback: function(msg, match, user, created) {
        user.active = false;
        user.save();
        logger.info('User %s is now inactive', user.telegramId);
        return 'Bot stopped. /start again later!';
    }

};
