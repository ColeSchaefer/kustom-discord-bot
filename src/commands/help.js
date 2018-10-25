const settings = require('../../settings.json');
const strings = require('../strings');
const fs = require('fs');

let Command = {
    Name: 'help',
    Description: 'Provide a list of all of the bot\'s available commands.',
    RequiredArguments: [],
    commandCallback: function(message, bot) {
        let commandArray = [];
        fs.readdir('./src/commands/', (err, files) => {
            if (err) throw (err);
            
            files.forEach((module) => {
			    let modulePath = './src/commands/'.concat(module);
			    let isModule = !fs.statSync(modulePath).isDirectory();
			    if (isModule) {
			        let moduleReq = require('./'.concat(module));
            	    let argParam = moduleReq.RequiredArguments.length > 0 ? ' *<' + moduleReq.RequiredArguments.join(', ').trim() + '>*' : '';
        	    	let field = {
                        name: '' + settings.prefix + moduleReq.Name + argParam,
                        value: moduleReq.Description,
                        inline: false
                    };
                    commandArray.push(field);
			    }
            });
            
            let embed = {
                author: { name: strings.GetString(settings.language, "HELP_COMMAND_LIST_TITLE") },
                color: 0x7289D9,
                fields: commandArray,
                footer: {
                    icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                    text: settings.invite_url },
                timestamp: new Date()
            };
            
     		message.channel.send(strings.GetString(settings.language, "HELP_COMMAND_LIST_MESSAGE") + ' ', { embed });
        });
    }
};
module.exports = Command;