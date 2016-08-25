'use strict';

var bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    events = require('events');

module.exports = function(app, config) {

    var emitter = new events.EventEmitter();
    var logger = config.logger;

    app.use(jsonParser);

    app.post('/', function(req, res) {

        if (req.body.type === 'pokemon') {
            emitter.emit('pokemon', req.body.message);
        }

        res.status(200).send();
    });

    app.listen(config.port, function() {
        logger.info('Express listening on port ' + config.port);
    });

    return emitter;
};
