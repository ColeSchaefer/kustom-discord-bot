const settings = require('../../settings.json');

let Command = {
    Name: 'set',
    Description: 'Adjust core bot settings (name, status, etc.)',
    RequiredArguments: ['property', 'arguments'],
    commandCallback: function(message, bot) {
	    var argv = message.content.substring(settings.prefix.length).split(' ');
        
        var args = '';
		for (var i = 2; i < argv.length; i++) {
			args += argv[i] + ' ';
		} args = args.trim();
        
        switch (argv[1]) {
            case 'name':
				bot.user.setUsername(args);
				message.channel.send(message.guild.member(message.author) + ' → Name set to: *' + args + '*');
				break;
			case 'game':
				bot.user.setActivity(args);
				message.channel.send(message.guild.member(message.author) + ' → Game set to: *' + args + '*');
				break;
			case 'status':
				bot.user.setStatus(args);
				message.channel.send(message.guild.member(message.author) + ' → Status set to: *' + args + '*');
				break;
			case 'nick':
				message.guild.members.get(bot.user.id).setNickname(args);
				message.channel.send(message.guild.member(message.author) + ' → Nickname set to: *' + args + '*');
				break;
			default:
				message.channel.send(
				    message.guild.member(message.author) + ' → Invalid property provided. ' + 
				    'Allowed properties: [*name*, *game*, *status*, *nick*]'
				);
			    return;
        }
    }
};
module.exports = Command;