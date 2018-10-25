const settings = require('../../settings.json');
const strings = require('../strings.js');

let Command = {
    Name: 'set',
    Description: 'Adjust core bot settings (name, status, etc.)',
    RequiredArguments: ['Property', 'Arguments'],
    commandCallback: function(message, bot) {
	    var argv = message.content.substring(settings.prefix.length).split(' ');
        
        var args = ''; for (var i = 2; i < argv.length; i++) { args += argv[i] + ' '; } args = args.trim();
        
        switch (argv[1]) {
            case 'name':
				bot.user.setUsername(args);
				message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "PROPERTY_SET_NAME") + ' *' + args + '*');
				break;
			case 'game':
				bot.user.setActivity(args);
				message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "PROPERTY_SET_GAME") + ' *' + args + '*');
				break;
			case 'status':
				bot.user.setStatus(args);
				message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "PROPERTY_SET_STATUS") + ' *' + args + '*');
				break;
			case 'nick':
				message.guild.members.get(bot.user.id).setNickname(args);
				message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "PROPERTY_SET_NICK") + ' *' + args + '*');
				break;
			default:
				message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "PROPERTY_INVALID"));
			    return;
        }
    }
};
module.exports = Command;