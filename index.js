const functions = require('./src/functions');
const handler = require('./src/handler');
const settings = require('./settings.json');
const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');

let bot = new Discord.Client();

// Bot is ready!
bot.on('ready', async (message) => { 
    let link = await bot.generateInvite(['ADMINISTRATOR']);
    console.log('\r\nBot User: '.cyan + '%s', bot.user.tag);
    console.log('Bot Link: '.cyan + '%s', link);
    console.log('Language: '.cyan + '%s', settings.language);
    
    // bot.emojis.forEach((e) => {
    // 	console.log('<:' + e.name + ':' + e.id + '>');
    // });
});

// New member joined!
bot.on('guildMemberAdd', (member) => {
	functions.SendWelcome(member, bot);
});

bot.on('messageReactionAdd', (reaction, user) => {
	console.log(reaction);
});

// Message received!
bot.on('message', async (message) => {
	if (message.author.equals(bot.user)) return;
	if (message.author.bot) return;
	
	// Handle our chat command.
	handler.handleChatCommand(bot, message);
	
});

bot.login(settings.bot_token);

