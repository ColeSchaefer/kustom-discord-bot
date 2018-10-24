const functions = require('./src/functions');
const settings = require('./settings.json');
const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');

var bot = new Discord.Client();

// Bot is ready!
bot.on('ready', async (message) => { 
    var link = await bot.generateInvite(['ADMINISTRATOR']);
    console.log('\r\nBot User: '.cyan + '%s', bot.user.tag);
    console.log('Bot Link: '.cyan + '%s', link);
});

// New member joined!
bot.on('guildMemberAdd', (member) => {
	functions.SendWelcome(member, bot);
});

// Message received!
bot.on('message', async (message) => {
	if (message.author.equals(bot.user)) return;
	if (message.author.bot) return;
    
    // Split our message into an argument array
	var argv = message.content.substring(settings.prefix.length).split(' ');
	
	fs.readdir('./src/commands/', (err, files) => {
		if (err) throw (err);
		
		files.forEach((module) => {
			let modulePath = './src/commands/'.concat(module);
			let isModule = !fs.statSync(modulePath).isDirectory();
			if (isModule) {
			    let moduleReq = require(modulePath);
			    // If the current module in the loop has a command name matching the user input, continue..
			    if (moduleReq.Name == argv[0]) {
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
				            description: (settings.prefix + moduleReq.Name).concat(' *' + usageDesc.trim() + '*')
				        };
			    		message.channel.send('Usage:', { embed });
			    	}
			    }
			}
		});
	});
	
});

bot.login(settings.bot_token);

