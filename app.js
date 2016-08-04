'use strict';

var express = require('express'),
    server = express(),
    config = require('config.json')('./config.json'),
    bot = require('./bot')(config),
    listener = require('./listener')(server, bot, config);
