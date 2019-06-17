const Logger = require('@elian-wonhalf/pretty-logger');
const Guild = require('../guild');
const Language = require('../language');

/**
 * @param {Message} message
 * @param {Array} args
 */
module.exports = async (message, args) => {
    const member = Guild.getMemberFromMessage(message);

    if (member === null) {
        message.reply('sorry, you do not seem to be on the server.');
        return;
    }

    if (Guild.isMemberMod(member)) {
        args = args.join(' ').split('|');

        const english = args[0];
        const french = args[1];

        if (!message.guild.roles.find(guildRole => guildRole.name === french)) {
            Guild.createRole(french)
                .then(role => {
                    message.reply(`new role added in Discord: ${role}`);

                    // then add to database
                    Language.add(english, french).then(() => {
                        message.reply(`new role added in the database: ${french}`);
                    }).catch(error => {
                        Logger.exception(error);
                        message.reply(`new role couldn't be added in the database: ${french}`);
                    });
                }).catch(error => {
                    Logger.exception(error);
                    message.reply(`new role couldn't be added in Discord: ${french}`);
                });
        } else {
            message.channel.send(`The role ${french} already exists.`);
        }
    }
};
