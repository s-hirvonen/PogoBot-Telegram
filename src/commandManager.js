'use strict';

var User = require('./user'),
    commands = require('./commands');

/**
 * Command Manager.
 * @module commandManager
 */
module.exports = function(config, bot) {

    /** Help command is special; lists the descriptions of all other commands */
    bot.onText(/\/help/, function(msg) {
        bot.sendMessage(
            msg.from.id,
            'Hello! I am PogoBot, and alert you of nearby Pokémon!\n\n' +
            'The following commands are available to you:\n' +
            commandDescriptions() + '\n' +
            '/help - Display this message'
        );
    });

    /** Enable all commands found in src/commands */
    commands.map(function(command) {
        bot.onText(command.pattern, function(msg, match) {
            User.findOrCreate({ telegramId: msg.from.id }, function(err, user, created) {
                if (err) {
                    logger.error(err);
                    return;
                }

                var replyMessage = command.callback(msg, match, user, created);

                if (replyMessage) {
                    bot.sendMessage(msg.from.id, replyMessage);
                }
            });
        });
    });

    /** Lists the descriptions for all available commands */
    function commandDescriptions() {
        return commands.reduce(function(previous, current) {
            return previous + '\n' + current.description;
        }, '');
    }
};

