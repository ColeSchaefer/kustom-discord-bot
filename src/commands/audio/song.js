const ytinfo = require('youtube-info');
const settings = require('../../../settings.json');
const strings = require('../../strings');
const audio = require('../../audio');
const translate = require('google-translate-api');
const fetch = require('node-fetch');

let Command = {
    Name: ['song'],
    Description: 'Display information about the currently playing track.',
    RequiredArguments: [],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    if (!message.member.voiceChannel) {
		    return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_NOT_IN_VOICE_CHANNEL"));
		}
		let tmpSongMsg = message.channel.send('Gathering information..').then((msg)=> {
			let server = audio.servers[message.guild.id];
			if(audio.currentId) {
			    ytinfo(audio.currentId.substring(32)).then((videoInfo) => {
    			    let embed = {
    			    	color: 0xFF0000,
    			        url: videoInfo.url,
    			        thumbnail: { url: videoInfo.thumbnailUrl },
    			        fields: [
    			            {
    			                name: '<:yt:505459222410952704>  **__Now Playing:__**',
    			                value: videoInfo.title,
    			            },
    			            {
    			                name: 'Uploader:',
    			                value: videoInfo.owner,
    			                inline: true
    			            },
    			            {
    			                name: 'Uploaded:',
    			                value: videoInfo.datePublished,
    			                inline: true
    			            },
			            ]
    			    };
    			    msg.edit({embed});
			    });
			}
		});
    }
};
module.exports = Command;

