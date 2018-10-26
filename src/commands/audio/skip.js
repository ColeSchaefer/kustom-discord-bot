const ytdl = require('ytdl-core');
const settings = require('../../../settings.json');
const strings = require('../../strings');
const audio = require('../../audio');
const translate = require('google-translate-api');
const fetch = require('node-fetch');

let Command = {
    Name: ['skip'],
    Description: 'Skip the currently playing track.',
    RequiredArguments: [],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    if (!message.member.voiceChannel) {
		    return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_NOT_IN_VOICE_CHANNEL"));
		}
		let server = audio.servers[message.guild.id];
		if (server.dispatcher) server.dispatcher.end();
		message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_SKIPPED_TRACK"));
    }
};
module.exports = Command;