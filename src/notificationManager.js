'use strict';

var fs = require('fs'),
    moment = require('moment'),
    request = require('request').defaults({ encoding: null }),
    User = require('./user');

module.exports = function(config, bot, listener) {

    var logger = config.logger;

    var pokemon = JSON.parse(fs.readFileSync('./locale/pokemon.en.json'));
    var seen = []; // Contains encounter ids of already processed pokemen

    logger.level = 'debug';

    // Webhook receives pokemon spawn info.
    // Unfiltered at this point
    listener.on('pokemon', function(payload) {

        if (seen.indexOf(payload.encounter_id) !== -1) {
            return;
        }

        logger.info(
            'A wild %s appeared! Disappear time %s',
            pokemon[payload.pokemon_id],
            payload.disappear_time
        );

        seen.push(payload.encounter_id);

        // Find all users that are active and watching this pokemon
        var query = User.find({ active: true, watchlist: Number(payload.pokemon_id) });

        query.then(function(users) {
            var userIds = users.map(function(user) {
                return user.telegramId;
            });
            sendPhoto(userIds, payload);
        });

    });

    function sendPhoto(users, payload) {
        var photo = getMap(payload.latitude, payload.longitude, function(err, res, body) {
            bot.sendPhotoNotification(
                users,
                body,
                'A wild ' + pokemon[payload.pokemon_id] + ' appeared!\n' +
                'Disappears at ' + disappearTime(payload.disappear_time) + '\n' +
                '(' + timeToDisappear(payload.disappear_time) + ' left)'
            );
        });
    }

    function timeToDisappear(timestamp) {
        var diff = moment.unix(timestamp).diff(moment());
        return moment.duration(diff).humanize();
    }

    function disappearTime(timestamp) {
        var time = moment.unix(timestamp);
        return [time.hour(), time.minutes(), time.seconds()].join(':');
    }

    function getMap(lat, lon, cb) {
        return request({
            method: 'GET',
               uri: 'https://maps.googleapis.com/maps/api/staticmap',
               qs: {
                   center: lat + ',' + lon,
                   zoom: 15,
                   size: '640x640',
                   key: config.gmap_key,
                   markers: lat + ',' + lon
               },
               callback: cb
        });
    };

};
