const settings = require('../../settings.json');
const strings = require('../strings');

let Command = {
    Name: 'ban',
    Description: 'Ban a user from the Discord server.',
    RequiredArguments: ['User Mention'],
    commandCallback: function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let userTo = message.mentions.users.first();
        
        if (argv[1] && userTo) {
            if (message.member.hasPermission('MANAGE_MESSAGES')) { 
    		    let userMember = message.guild.member(message.mentions.users.first());
    		    message.guild.member(userMember).ban();
    		    message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "USER_BAN_MESSAGE"));
    		}
        }
    }
};
module.exports = Command;