const settings = require('../../../settings.json');
const strings = require('../../strings');

let Command = {
    Name: ['vkick'],
    Description: 'Kick a user from their voice channel.',
    RequiredArguments: ['User Mention'],
    commandCallback: async function(message, bot) {
	    if (!message.member.voiceChannel) {
		    return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_NOT_IN_VOICE_CHANNEL"));
		}
		let mention = message.mentions.users.first();
		if (!mention) return message.channel.send(message.guild.member(message.author) + ' → No user specified.');
	    let member = message.guild.member(mention);
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.guild.createChannel('VOICE_KICK', 'voice').then((channel) => {
                member.setVoiceChannel(channel).then((user) => {
                    channel.delete();
                    let memberUserName = message.guild.member(message.mentions.users.first()).user.username;
                    message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_USER_VOICE_KICKED"));
                });
            });
        }
    }
};
module.exports = Command;