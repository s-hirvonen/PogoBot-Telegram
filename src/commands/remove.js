'use strict';

var pokedex = require('../pokedex');

module.exports = {

    pattern: /\/remove (.+)/,

    description: '/remove name [name]... - Removes Pokémon from the watchlist',

    list: false,

    callback: function(msg, match, user, created) {
        var toRemoveIds = pokedex.getPokemonIdsFromArgumentString(match[1]);

        user.watchlist = user.watchlist.filter(function(number) {
            return toRemoveIds.indexOf(number) === -1;
        });

        user.save();
    }

};
