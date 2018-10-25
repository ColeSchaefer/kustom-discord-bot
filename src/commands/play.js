const ytdl = require('ytdl-core');
const settings = require('../../settings.json');
const strings = require('../strings');
const translate = require('google-translate-api');
const fetch = require('node-fetch');

// TODO: These need to move to a global function to access in OTHER functions..
let servers = {};
let currentId = 0;
let ytStream;

function playAudio(connection, message) {
	let server = servers[message.guild.id];
	currentId = server.queue[0];
	if (currentId) ytStream = ytdl(currentId, {filter: 'audioonly'});
	server.dispatcher = connection.playStream(ytStream);
	server.dispatcher.on('end', function() {
		if (currentId) {
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
	let server = servers[message.guild.id];
	let searchUrl = "https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query + ' lyrics official audio') + "&key=" + settings.yt_token;
	fetch(searchUrl).then((res) => res.json()).then((json) => {
		let result = 'https://www.youtube.com/watch?v=' + json.items[0].id.videoId;
		
		server.queue.push(isYouTubeUrl(query) ? query : result);
		
		if (server.queue.length > 0) message.channel.send('Added to queue!');
	
		if (!message.guild.voiceConnection) {
			message.member.voiceChannel.join().then(function(connection) {
				playAudio(connection, message);
			});
		}
	});
}

let Command = {
    Name: 'play',
    Description: 'Search & play a song from Spotify or YouTube.',
    RequiredArguments: ['song|url'],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    if (!message.member.voiceChannel) {
    		return message.channel.send('You must be in a voice channel to play a song.');
		}
		if (!servers[message.guild.id]) servers[message.guild.id] = {
			queue: []
		};
		let query = '';
		for (let i = 1; i < argv.length; i++) {
			query += argv[i] + ' ';
		} query = query.trim();
		if (isSpotifyUrl(query)) {
		    let trackId;
		    // If link is HTTP(S)
		    if(query.includes('http')) {
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
		    query = json.name + ' - ' + json.artists[0].name;
		    return searchVideo(message, query);
		} else {
		    // Just a raw search query..
		    query = query.trim();
		    return searchVideo(message, query);
		}
    }
};
module.exports = Command;