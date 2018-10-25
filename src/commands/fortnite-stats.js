const settings = require('../../settings.json');
const strings = require('../strings');
const fetch = require('node-fetch');

let Command = {
    Name: 'fnstats',
    Description: 'Retrieve the Fortnite stats of any player.',
    RequiredArguments: ['Platform', 'Player Name'],
    commandCallback: function(message, bot) {
        const modes = {
          p2: 'Solo',
          p10: 'Duo',
          p9: 'Squad'
        };
        async function isXbl(platform) {
            return (platform == 'xb1' || platform == 'xbl');
        }
        async function isPsn(platform) {
            return (platform == 'ps4' || platform == 'psn');
        }
        async function isConsole(platform) {
            return (isPsn(platform) || isXbl(platform));
        }
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let platforms = ['pc', 'ps4', 'psn', 'xb1', 'xbl'];
        let platform = argv[1];
        
        if(platforms.indexOf(platform) > -1) {
            let args = ''; for (let i = 2; i < argv.length; i++) { args += argv[i] + ' '; } args = args.trim();
            let username;
            switch(platform) {
                case 'xbl':
                case 'xb1':
                    username = 'xbl(';
                    break;
                case 'psn':
                case 'ps4':
                    username = 'psn(';
                    break;
                default:
                    username = '';
                    break;
            }
            username += args;
            if (isConsole(platform)) username += ')';
            let statsUrl = 'http://api.cschaefer.me/fortnite/tracknet.php'.concat('?username=' + username).concat('&platform=' + platform);
            fetch(statsUrl).then((res) => res.json()).then((stats) => {
                let fields = [];
                let fieldStrings = {
                    'SoloL': '',
                    'SoloR': '',
                    'DuoL': '',
                    'DuoR': '',
                    'SquadL': '',
                    'SquadR': ''
                };
                Object.keys(modes).forEach((mode, index, array) => {
                    let modeData = stats.stats[mode];
                    Object.keys(modeData).forEach((field, fid, arr) => {
                        let entry = '**' + modeData[field].label + '**: ' + modeData[field].value;
                        let gamemode = modes[mode];
                        
                        fieldStrings[gamemode + (fid % 2 == 0 ? 'L' : 'R')] += entry + "\n";
                    });
                });
                
                Object.keys(fieldStrings).forEach((entry, index, array) => {
                    
                    let fieldTitle = Object.keys(fieldStrings)[index];
                    fieldTitle = fieldTitle.substring(0, fieldTitle.length - 1);
                    
                    fields.push({
                        name: (index % 2) == 0 ? '**__' + fieldTitle.toUpperCase() + '__**' : '\u200b',
                        value: fieldStrings[entry],
                        inline: true
                    });
                });
                
                let embed = {
                    thumbnail: { url: 'https://api.cschaefer.me/discord/misc/fnbr.png' },
                    author: { name: stats.epicUserHandle.concat('\'s All-time Stats')},
                    fields: fields
                };
                message.channel.send({embed});
            });
        // Invalid platform specified.
        } else {
            
        }
    }
};
module.exports = Command;



// var platform = args[1];
// 		if (platform != "pc" && platform != "ps4" && platform != "xb1") {
// 			botCommands.msgCommands.tempMessage(message, botCommands.msgCommands.getEmbed('Please provide a valid platform!'), 3500);
// 			return;
// 		}
// 		var username = ''; for(var i = 2; i < args.length; i++) username += args[i] + ' '; username = username.trim();
// 		var stats_url = 'http://api.imbypass.pw/fortnite/stats/' + platform + '/' + username.replace(/ /g, '+');
		
// 		let plat;
// 		switch(platform) {
// 			case 'ps4': plat = 'PlayStation 4'; break;
// 			case 'xb1': plat = 'Xbox One'; break;
// 			case 'pc': plat = 'PC/Mac'; break;
// 			case 'switch': plat = 'Nintendo Switch'; break;
// 			case 'mobile': plat = 'iOS/Android'; break;
// 			default: plat = 'Unknown Platform'; break;
// 		}
// 		request(stats_url, function(err, res, body) {  
// 			let stats = JSON.parse(body);
// 			if(!stats.error) {
// 				var embed = new Discord.RichEmbed()
// 					.setAuthor(stats.info.username + '\'s All-time Stats', 'https://image.fnbr.co/pr&ice/icon_vip.png', 'http://tracker.imbypass.pw/player/' + platform + '/' + username.replace(/ /g, '+'))
// 					.setColor(0xC06EFF)
// 					.setColor(0xEF4A82)
// 					.addField('Username:', stats.info.username, true)
// 					.addField('Platform:', plat, true)
// 					.addField('Score:', stats.lifetimeStats.score, true)
// 					.addField('\u200b', '\u200b')
					
// 					.addField('Solo Kills:', stats.group.solo.kills, true)
// 					.addField('Solo Wins:', stats.group.solo.wins, true)
// 					.addField('Solo K/D Ratio:', (stats.group.solo.kd) + '**%**', true)
// 					.addField('Duo Kills:', stats.group.duo.kills, true)
// 					.addField('Duo Wins:', stats.group.duo.wins, true)
// 					.addField('Duo K/D Ratio:', (stats.group.duo.kd) + '**%**', true)
// 					.addField('Squad Kills:', stats.group.squad.kills, true)
// 					.addField('Squad Wins:', stats.group.squad.wins, true)
// 					.addField('Squad K/D Ratio:', (stats.group.squad.kd) + '**%**', true)
// 					.addField('\u200b', '\u200b')
					
// 					.addField('Total Wins:', stats.lifetimeStats.wins, true)
// 					.addField('Matches Played:', (stats.lifetimeStats.matches), true)
// 					.addField('Win Rate:', (stats.lifetimeStats.winrate) + '**%**', true)
// 					.addField('Total Kills:', stats.lifetimeStats.kills, true)
// 					.addField('\u200b', '\u200b', true)
// 					.addField('K/D Ratio:', (stats.lifetimeStats.kd) + '**%**', true)
					
// 					.setFooter(stats.info.username + ' (' + stats.info.accountId + ')')
// 					.setTimestamp()
// 				message.author.send(embed);
// 			} else {
// 				botCommands.msgCommands.tempMessage(message, botCommands.msgCommands.getEmbed('Unable to parse information for player "' + username + '"'), 3500);
// 			}
// 		});