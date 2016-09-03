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

                // Send the generated reply message and update reply keyboard
                if (replyMessage) {
                    bot.sendMessage(msg.from.id, replyMessage, {
                        reply_markup: {
                            keyboard: generateReplyKeyboard(user)
                        }
                    });
                }
            });
        });
    });

    /** Returns all commands that have list: true */
    function generateReplyKeyboard(user) {
        var enabledCommandNames = commands.filter(function(command) {
            // Get enabled commands
            if (typeof command.list === 'function') {
                return command.list(user);
            }
            else return !!command.list;
        }).map(function(command) {
            // Construct Telegram API KeyboardButton objects
            return [{ text: command.name }];
        });

        return enabledCommandNames;
    }

    /** Lists the descriptions for all available commands */
    function commandDescriptions() {
        return commands.reduce(function(previous, current) {
            return previous + '\n' + current.description;
        }, '');
    }
};

