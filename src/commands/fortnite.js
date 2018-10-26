const settings = require('../../settings.json');
const strings = require('../strings');
const fetch = require('node-fetch');
const util = require('util');

let Command = {
    Name: ['fortnite', 'fnbr', 'fn'],
    Description: 'Retrieve the Fortnite stats of any player.',
    RequiredArguments: ['Platform', 'Player Name'],
    commandCallback: function(message, bot) {
        const modes = {
          p2: 'Solo',
          p10: 'Duo',
          p9: 'Squad'
        };
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let platforms = ['pc', 'ps4', 'psn', 'xb1', 'xbl'];
        let platform = argv[1];
        
        message.channel.send('Searching..').then((msg) => {
            if (platforms.indexOf(platform) > -1) {
                let args = ''; for (let i = 2; i < argv.length; i++) { args += argv[i] + ' '; } args = args.trim();
                let username; username = args;
                let statsUrl = 'http://api.cschaefer.me/discord/tracker.php'.concat('?title=' + argv[0]).concat('&username=' + username).concat('&platform=' + platform);
                fetch(statsUrl).then((res) => res.json()).then((stats) => {
                    if (stats.error) {
                        msg.edit(message.guild.member(message.author) + ' → ' + util.format(strings.GetString(settings.language, "FNSTATS_NOT_FOUND"), username));
                        return;
                    }
                    
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
                            
                            if(!entry.includes('TRN')) fieldStrings[gamemode + (fid % 2 === 0 ? 'R' : 'L')] += entry + "\n";
                        });
                    });
                    fields.push({
                       name: '<:battlepass:505456440475910145>  '.concat(util.format(strings.GetString(settings.language, "FNSTATS_TITLE"), stats.epicUserHandle)),
                       value: '\u200b'
                    });
                    Object.keys(fieldStrings).forEach((entry, index, array) => {
                        let fieldTitle = Object.keys(fieldStrings)[index];
                        fieldTitle = fieldTitle.substring(0, fieldTitle.length - 1);
                        
                        fields.push({
                            name: (index % 2) === 0 ? '**__' + fieldTitle.toUpperCase() + '__**' : '\u200b',
                            value: fieldStrings[entry],
                            inline: true
                        });
                    });
                    
                    let embed = {
                        color: 0xF9CC40,
                        thumbnail: { url: 'https://api.cschaefer.me/discord/misc/fnbr.png' },
                        fields: fields,
                        footer: {
                            text: settings.invite_url,
                            icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png"
                        },
                        timestamp: new Date()
                    };
                    msg.edit({embed});
                });
            // Invalid platform specified.
            } else {
               
            }
        });
    }
};
module.exports = Command;