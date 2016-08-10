'use strict';

var mongoose = require('mongoose'),
    Pokedex = require('./pokedex'),
    config = require('config.json')('./config.json'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    telegramId: String,
    active: {
        type: Boolean,
        default: true
    },
    watchlist: {
        type: [Number], // Collection of pokedex numbers
        default: Pokedex.getPokemonIdsByNames(config.watchlist)
    }
});

UserSchema.plugin(require('mongoose-findorcreate'));

module.exports = mongoose.model('User', UserSchema);
