'use strict';

var pokedex = require('../pokedex');

module.exports = {

    pattern: /\/reset/,

    description: '/reset - Reset your watchlist to the default.\n',

    list: true,

    callback: function(msg, match, user, created) {
        logger.info('Watchlist reset request from %s', msg.from.id);
        user.watchlist = Pokedex.getPokemonIdsByNames(config.watchlist);
        user.save();
    }

};
