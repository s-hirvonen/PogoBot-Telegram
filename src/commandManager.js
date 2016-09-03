'use strict';

var User = require('./user'),
    commands = require('./commands');

module.exports = function(config, bot) {

    bot.onText(/\/help/, function(msg) {
        bot.sendMessage(
            msg.from.id,
            'Hello! I am PogoBot, and alert you of nearby Pokémon!\n\n' +
            'The following commands are available to you:\n' +
            commandDescriptions() + '\n' +
            '/help - Display this message'
        );
    });

    commands.map(function(command) {
        onCommand(command.pattern, command.callback);
    });

    function commandDescriptions() {
        return commands.reduce(function(previous, current) {
            return previous + '\n' + current.description;
        }, '');
    }

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

