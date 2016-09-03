'use strict';

var pokedex = require('../pokedex');

module.exports = {

    pattern: /\/add (.+)/,

    description: '/add name [name]... - Adds Pokémon to the watchlist',

    list: false,

    callback: function(msg, match, user, created) {
        var toAddIds = pokedex.getPokemonIdsFromArgumentString(match[1]).filter(function(item) {
            return user.watchlist.indexOf(item) === -1;
        });

        user.watchlist = user.watchlist.concat(toAddIds).sort(function(a, b) {
            return a - b;
        });
        user.save();
    }

};
