const settings = require('../../../settings.json');
const strings = require('../../strings');
const util = require('util');

let Command = {
    Name: ['language', 'lang'],
    Description: 'Change the bot language',
    RequiredArguments: [],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    
	    settings.language = argv[1];
	    
		message.channel.send(message.guild.member(message.author) + ' → ' + util.format(strings.GetString(settings.language, "LANGUAGE_SET"), argv[1]));
    }
};
module.exports = Command;