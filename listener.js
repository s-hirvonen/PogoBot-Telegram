'use strict';

var bodyParser = require('body-parser'),
    jsonParser = bodyParser.json();

module.exports = function(app, bot, config) {

    app.use(jsonParser);

    app.post('/', function(req, res, next) {
        console.log(req.body);
        next();
    });

    app.listen(config.port, function() {
        console.log('Express listening on port ' + config.port);
    });

};
