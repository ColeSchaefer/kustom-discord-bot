const settings = require('../settings.json');
const recursive = require("recursive-readdir");
const fs = require('fs');

module.exports = {
    handleChatCommand: function(bot, message) {
        // Split our message into an argument array
        let argv = message.content.substring(settings.prefix.length).split(' ');
        recursive('./src/commands/', (err, files) => {
    		if (err) throw (err);
    		
    		files.forEach((module) => {
    			if (!module.includes('disabled')) {
    			    let workingDirArr = __dirname.split('/');
    			    let toRemove = workingDirArr[workingDirArr.length - 1];
    			    let modulePath = __dirname.replace(toRemove, '').concat(module);
    			    let moduleReq = require(modulePath);
    			    // If the current module in the loop has a command name matching the user input, continue..
    			    moduleReq.Name.forEach((Name) => {
        			    if (Name === argv[0]) {
        			    	// If the required number of arguments is met, continue..
        			    	if ((argv.length - 1) >= moduleReq.RequiredArguments.length) {
        			    		// Execute the module commandCallback();
        			    		moduleReq.commandCallback(message, bot);
        			    	// The number of arguments was not met. Display required arguments for user.
        			    	} else {
        			    		let usageDesc = '';
        			    		for (let i = 0; i < moduleReq.RequiredArguments.length; i++)
        			    			usageDesc += '<' + moduleReq.RequiredArguments[i] + '> ';
        			    		let embed = {
        			    			color: 0x7289D9,
        				            description: (settings.prefix + moduleReq.Name[0]).concat(' *' + usageDesc.trim() + '*')
        				        };
        			    		message.channel.send('Usage:', { embed });
        			    	}
        			    }
    			    });
    			}
    		});
    	});
    }
}