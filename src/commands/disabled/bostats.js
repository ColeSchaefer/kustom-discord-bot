const ytdl = require('ytdl-core');
const settings = require('../../settings.json');
const strings = require('../strings');
const request = require('request');

// Get content between 2 strings
function getBetween(content, start, end) {
  let arr = content.split(start);
  if (arr[1]) {
    return arr[1].split(end)[0];
  }
  return '';
}
function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }
    return tempArray;
}

let Command = {
    Name: 'bo4stats',
    Description: 'Get a players Black Ops Stats',
    RequiredArguments: ['Platform', 'Username'],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let platforms = ['ps4', 'psn', 'xb1', 'xbl'];
        let platform = argv[1];
        
        if (platforms.indexOf(platform) > -1) {
            let args = '';
            for (let i = 2; i < argv.length; i++) { args += argv[i] + ' '; }
            args = args.trim();
            let username = args;
    	    
    	    let apiUrl = 'https://cod.tracker.gg/bo4/profile/' + platform + '/' + username;
    	    
    	    request(apiUrl, (err, resp, body) => {
    	        if (err) throw (err);
    	        let generalStatsRaw = getBetween(body, '<script type="text/javascript">var imp_careerStats = ', ';</script>');
    	        let generalStats = JSON.parse(generalStatsRaw);
    	        let keyArray = Object.keys(generalStats);
    	        
    	        username = getBetween(body, '<trn-profile-header-favorite :platform="2" nickname="', '" storage="bo4"></trn-profile-header-favorite>');
    	        
    	        let fields = [];
    	        let statStrings = [];
    	        keyArray.forEach((elem, index, array) => {
    	            let key = elem;
    	            let entryName = generalStats[key].displayName
    	            let entryValue = generalStats[key].value;
    	            let entry = '**' + entryName + '**: ' + entryValue;
    	            
    	            if(entryName != undefined && entryValue != undefined)
    	                statStrings.push(entry);
    	        });
    	        let arrLength = Math.ceil(statStrings.length / 4);
    	        
    	        let arrayChunks = chunkArray(statStrings, arrLength);
    	        
    	        arrayChunks.forEach((elem, index, array) => {
    	           let statsArr = elem;
    	           let statString;
    	           statsArr.forEach((e, i, a) => {
    	               statString += e.concat("\n");
    	           });
    	           fields.push({
                        name: '\u200b',
                        value: statString.replace(/undefined/g, ''),
                        inline: true
    	           });
    	        });
    	        
    	        let embed = {
                    color: 0xFF6E03,
                    thumbnail: { url: 'https://api.cschaefer.me/discord/misc/codbo4.png' },
                    author: {
                        name: username + '\'s '.concat(strings.GetString(settings.language, "BO4STATS_TITLE"))
                    },
                    fields: fields,
                    footer: {
                        text: settings.invite_url,
                        icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png"
                    },
                    timestamp: new Date()
                };
                message.channel.send({embed});
    	    });
        }
    }
};
module.exports = Command;