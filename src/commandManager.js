'use strict';

var User = require('./user'),
    commands = require('./commands');

module.exports = function(config, bot) {

    commands.map(function(command) {
        onCommand(command.pattern, command.callback);
    });

    function onCommand(pattern, callback) {
        bot.onText(pattern, function(msg, match) {
            User.findOrCreate({ telegramId: msg.from.id }, function(err, user, created) {
                if (err) {
                    logger.error(err);
                    return;
                }
                var replyMessage = callback(msg, match, user, created);

                if (replyMessage) {
                    bot.sendMessage(msg.from.id, replyMessage);
                }
            });
        });
    }
};

