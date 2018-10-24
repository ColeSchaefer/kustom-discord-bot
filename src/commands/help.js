const settings = require('../../settings.json');
const fs = require('fs');

let Command = {
    Name: 'help',
    Description: 'Provide a list of all of the bot\'s available commands.',
    RequiredArguments: [],
    commandCallback: function(message, bot) {
        let commandArray = [];
        fs.readdirSync('./src/commands/').forEach((module) => {
    	    let moduleReq = require('./'.concat(module));
	    	let field = {
                name: settings.prefix + moduleReq.Name,
                value: moduleReq.Description,
                inline: false
            };
            commandArray.push(field);
    	});
        let embed = {
            author: { name: 'Kommand List' },
            color: 0x7289D9,
            fields: commandArray,
            footer:
            {
                icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                text: settings.invite_url
            },
        };
 		message.channel.send('Here is a list of my commands: ', { embed });
    }
};
module.exports = Command;