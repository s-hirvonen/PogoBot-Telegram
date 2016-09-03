'use strict';

var fs = require('fs'),
    _ = require('lodash'),
    pokedex = JSON.parse(fs.readFileSync(__dirname + '/../locale/pokemon.en.json'));

exports.pokedex = pokedex;

exports.getPokemonIdByName = function(name) {
    return _.findKey(pokedex, function(p) {
        return p.toLowerCase() === name.toLowerCase();
    });
};

// Receives an array and returns the pokedex numbers of the given pokemen
// If a given pokemon name doesn't exist, it is ignored.
exports.getPokemonIdsByNames = function(names) {
    return names.map(function(name) {
        return exports.getPokemonIdByName(name);
    }).filter(function(p) {
        return p !== undefined;
    }).map(function(p) {
        return Number(p);
    });
};

exports.getPokemonIdsFromArgumentString = function (str) {
    var args = str.split(/[\s,]/).filter(function(value) {
        return value !== '';
    });

    var ids = [];

    args.map(function(pokemon) {
        if (!isNaN(Number(pokemon))) {
            // Pokedex number passed
            ids.push(Number(pokemon));
        } else {
            // Pokémon name passed
            var id = Number(exports.getPokemonIdByName(pokemon));
            if (id !== NaN) ids.push(id);
        }
    });

    return ids;
};
