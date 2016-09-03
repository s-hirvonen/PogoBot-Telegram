'use strict';

var pokedex = require('../pokedex'),
    logger = require('winston');

module.exports = {

    pattern: /\/start/,

    description: '/start - Start the bot',

    list: false,

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
