'use strict';

var pokedex = require('../pokedex');

module.exports = {

    pattern: /\/list/,

    description: '/list - Lists Pokémon on your watchlist',

    list: true,

    callback: function(msg, match, user, created) {
        return printWatchlist(user.watchlist);
    }

};

function printWatchlist(list) {
    var names = list.map(function(number) {
        return pokedex.pokedex[number];
    });

    return 'Pokémon on your watchlist:\n\n' + names.join('\n');
}
