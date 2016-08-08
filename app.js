'use strict';

var fs = require('fs'),
    logger = require('winston'),
    moment = require('moment'),
    express = require('express'),
    request = require('request').defaults({ encoding: null }),
    server = express(),
    config = require('config.json')('./config.json'),
    bot = require('./bot')(config),
    listener = require('./listener')(server, config);

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

    logger.log('debug', payload);

    if (!bot.isWatching(pokemon[payload.pokemon_id])) {
        return;
    }

    logger.log('debug', payload);

    var photoFilePath = './.tmp/' + payload.encounter_id + '.png';
    var photo = fs.createWriteStream(photoFilePath);
    getMap(payload.latitude, payload.longitude).pipe(photo);
    photo.on('close', function() {
        bot.sendPhotoNotification(
            photoFilePath,
            'A wild ' + pokemon[payload.pokemon_id] + ' appeared!\n' +
            'Disappears at ' + disappearTime(payload.disappear_time) + '\n' +
            '(' + timeToDisappear(payload.disappear_time) + ' left)'
        );
    });

});

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
