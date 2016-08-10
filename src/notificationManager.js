'use strict';

var fs = require('fs'),
    moment = require('moment'),
    _ = require('lodash'),
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


        seen.push(payload.encounter_id);

        // Find all users that are active and watching this pokemon
        User.find({ active: true, watchlist: Number(payload.pokemon_id) })
            .then(function(users) {
                logger.info(
                    'Wild %s appeared!\t Disappear time %s\t Users watching %s\t Seen pokemon %s',
                    pokemon[payload.pokemon_id],
                    payload.disappear_time,
                    _.map(users, 'telegramId'),
                    seen.length
                );

                var userIds = users.map(function(user) {
                    return user.telegramId;
                });
                sendPhoto(userIds, payload);
            });

    });

    setInterval(function() {
        seen = [];
        logger.debug('Cleared seen pokemon');
    }, 15 * 60 * 1000);

    function sendPhoto(users, payload) {
        var photo = getMap(payload.latitude, payload.longitude, function(err, res, body) {

            if (res.statusCode !== 200) {
                logger.error('Request failed with code %s', res.statusCode);
                logger.error('Make sure you have Static Maps API enabled on your key.');
                throw new Error('Failed to get map image from Google Maps API.');
            }

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
