'use strict';

var fs = require('fs'),
    moment = require('moment'),
    _ = require('lodash'),
    request = require('request').defaults({ encoding: null }),
    User = require('./user');

module.exports = function(config, bot, listener) {

    var logger = config.logger;

    var pokemon = JSON.parse(fs.readFileSync('./locale/pokemon.en.json'));
    var seen = []; // Contains encounter data of already processed pokemen

    logger.level = 'debug';

    // Webhook receives pokemon spawn info.
    // Unfiltered at this point
    listener.on('pokemon', function(payload) {

        // Webhook gave us an expired pokemon. It happens, just ignore
        if (moment().unix() > payload.disappear_time) {
            return;
        }

        // We have seen this pokemon
        if (_.find(seen, { id: payload.encounter_id}) !== undefined) {
            logger.debug(
                'Ignoring duplicate encounter of %s\t encounter_id %s',
                pokemon[payload.pokemon_id],
                payload.encounter_id
            );
            return;
        }

        seen.push({
            id: payload.encounter_id,
            disappear: payload.disappear_time
        });

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

                if (userIds.length) {
                    sendPhoto(userIds, payload);
                }
            });

    });

    setInterval(function() {
        seen = _.filter(seen, function(encounter) {
            return encounter.disappear > moment().unix();
        });
        logger.debug('Cleared seen and expired pokemon');
    }, 15 * 60 * 1000);

    function sendPhoto(users, payload) {
        logger.debug('Starting map image download...');
        getMap(payload.latitude, payload.longitude, function(err, res, photo) {

            logger.debug('Map download complete');

            if (err) {
                logger.error('Error when downloading map image:');
                logger.error(err);
                return;
            }

            logger.debug(payload);

            if (res.statusCode !== 200) {
                logger.error('Request failed with code %s', res.statusCode);
                logger.error('Make sure you have Static Maps API enabled on your key.');
                throw new Error('Failed to get map image from Google Maps API.');
            }

            bot.sendPhotoNotification(
                users,
                photo,
                'A wild ' + pokemon[payload.pokemon_id] + ' appeared!\n' +
                timeToDisappear(payload.disappear_time) + ' left, ' +
                'disappears at ' + disappearTime(payload.disappear_time) + '\n',
                [payload.latitude, payload.longitude]
            );
        });
    }

    function timeToDisappear(timestamp) {
        var diff = moment.unix(timestamp).diff(moment());
        return moment.utc(moment.duration(diff).asMilliseconds()).format("m[m] ss[s]");
    }

    function disappearTime(timestamp) {
        return moment.unix(timestamp).format('HH:mm:ss');
    }

    function getMap(lat, lon, cb) {
        return request({
            method: 'GET',
               uri: 'https://maps.googleapis.com/maps/api/staticmap',
               qs: {
                   center: lat + ',' + lon,
                   zoom: 16,
                   size: '1080x1080',
                   key: config.gmap_key,
                   markers: lat + ',' + lon
               },
               callback: cb
        });
    };

};
