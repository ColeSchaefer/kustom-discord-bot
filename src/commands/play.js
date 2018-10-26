const ytdl = require('ytdl-core');
const settings = require('../../settings.json');
const strings = require('../strings');
const audio = require('../audio');
const fetch = require('node-fetch');

function playAudio(connection, message) {
	let server = audio.servers[message.guild.id];
	audio.currentId = server.queue[0];
	if (audio.currentId) audio.ytStream = ytdl(audio.currentId, { filter: 'audioonly' });
	server.dispatcher = connection.playStream(audio.ytStream);
	server.dispatcher.on('end', function() {
		if (audio.currentId) {
			server.queue.shift();
			playAudio(connection, message);
		}
		else { connection.disconnect(); }
	});
}
function isYouTubeUrl(str) {
	return str.toLowerCase().indexOf("youtube.com") > -1;
}
function isSpotifyUrl(str) {
	return str.toLowerCase().indexOf("spotify") > -1;
}
function searchVideo(message, query) {
	let server = audio.servers[message.guild.id];
	let searchUrl = "https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query + ' lyrics official audio') + "&key=" + settings.yt_token;
	fetch(searchUrl).then((res) => res.json()).then((json) => {
		let result = 'https://www.youtube.com/watch?v=' + json.items[0].id.videoId;
		
		server.queue.push(isYouTubeUrl(query) ? query : result);
		
		if (server.queue.length > 0) {
			message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_ADDED_TO_QUEUE"));
		}
	
		if (!message.guild.voiceConnection) {
			message.member.voiceChannel.join().then(function(connection) {
				playAudio(connection, message);
			});
		}
	});
}

let Command = {
    Name: ['play', 'p'],
    Description: 'Search & play a song from Spotify or YouTube.',
    RequiredArguments: ['Search Term / URL'],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    if (!message.member.voiceChannel) {
		    return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "AUDIO_NOT_IN_VOICE_CHANNEL"));
		}
		if (!audio.servers[message.guild.id]) audio.servers[message.guild.id] = {
			queue: []
		};
		let query = '';
		for (let i = 1; i < argv.length; i++) {
			query += argv[i] + ' ';
		} query = query.trim();
		if (isSpotifyUrl(query)) {
		    let trackId;
		    // If link is HTTP(S)
		    if (query.includes('http')) {
		        let tmpArr = query.split('/');
		        trackId = tmpArr[tmpArr.length - 1];
		    // If link is Spotify:Open
		    } else {
		        let tmpArr = query.split('spotify');
			    trackId = tmpArr[tmpArr.length - 1];tmpArr = trackId.split('track');
			    trackId = tmpArr[tmpArr.length - 1].replace('/', '').replace(':', '');
		    }
			let trackApiUrl = 'http://api.cschaefer.me/spotify/?id=' + trackId;
			let res = await fetch(trackApiUrl);
            let json = await res.json();
            if(!json.error) {
		    	query = json.name + ' - ' + json.artists[0].name;
		    	return searchVideo(message, query);
            }
            return;
		} else {
		    // Just a raw search query..
		    query = query.trim();
		    return searchVideo(message, query);
		}
    }
};
module.exports = Command;