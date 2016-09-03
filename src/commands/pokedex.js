'use strict';

var pokedex = require('../pokedex'),
    _ = require('lodash');

module.exports = {

    pattern: /\/pokedex/,

    description: '/pokedex - List all known Pokémon',

    list: true,

    callback: function(msg, match, user, created) {
        return printPokemonList(pokedex.pokedex);
    }

};

function printPokemonList(list) {
    var names = [];
    _.forEach(list, function(name, number) {
        names.push(number + ') ' + name);
    });

    return 'All known Pokémon:\n\n' + names.join('\n');
}
