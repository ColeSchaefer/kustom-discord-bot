const settings = require('../../../settings.json');
const strings = require('../../strings');
const recursive = require("recursive-readdir");

let Command = {
    Name: ['help'],
    Description: 'Provide a list of all of the bot\'s available commands.',
    RequiredArguments: [],
    commandCallback: function(message, bot) {
        let commandArray = [];
        recursive('./src/commands/', (err, files) => {
            
            if (err) console.log(err);
            files.forEach((module) => {
			    let modulePath = './'.concat(module);
			    if (!module.includes('disabled')) {
			        
    			    let workingDirArr = __dirname.split('/');
    			    let toRemove = workingDirArr[workingDirArr.length - 1];
    			    let moduleName = module.replace(/src\/commands\//g, '');
    			    let modulePath = __dirname.replace(toRemove, '').concat(moduleName);
    			    
			        let moduleReq = require(modulePath);
            	    let argParam = moduleReq.RequiredArguments.length > 0 ? ' *<' + moduleReq.RequiredArguments.join(', ').trim() + '>*' : '';
            	    
            	    let aliases = '';
            	    let aliasCount = moduleReq.Name.length - 1;
            	    if(aliasCount > 0) {
                	    for(let i = 1; i < aliasCount; i++) {
                	        aliases += '**' + settings.prefix + moduleReq.Name[i] + '**, ';
                	    } aliases += '**' + settings.prefix + moduleReq.Name[moduleReq.Name.length - 1] + '**';
            	    }
        	    	let field = {
                        name: '' + settings.prefix + moduleReq.Name[0] + argParam,
                        value: moduleReq.Description + (aliases.length > 0 ? ' *(Aliases: ' + aliases.trim() + ')*' : ''),
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