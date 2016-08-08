'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    telegramId: String,
    active: Boolean,
    watchlist: [Number] // Collection of pokedex numbers
});

UserSchema.plugin(require('mongoose-findorcreate'));

module.exports = mongoose.model('User', UserSchema);
