const ytdl = require('ytdl-core');
const settings = require('../../settings.json');
const strings = require('../strings');
const audio = require('../audio');
const translate = require('google-translate-api');
const fetch = require('node-fetch');

let Command = {
    Name: ['stop'],
    Description: 'Stop the currently playing track.',
    RequiredArguments: [],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    if (!message.member.voiceChannel) {
		    return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_NOT_IN_VOICE_CHANNEL"));
		}
	    if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
		let server = audio.servers[message.guild.id];
		message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_STOPPED_TRACK"));
    }
};
module.exports = Command;