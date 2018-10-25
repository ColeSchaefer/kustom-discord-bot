const settings = require('../../settings.json');
const strings = require('../strings');
const fetch = require('node-fetch');

let Command = {
    Name: 'bo4',
    Description: 'Retrieve the Black Ops 4 stats of any player.',
    RequiredArguments: ['Platform', 'Player Name'],
    commandCallback: function(message, bot) {
        
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let platforms = ['ps4', 'psn', 'xb1', 'xbl'];
        let platform = argv[1];
        
        message.channel.send('Searching..').then((msg) => {
            if (platforms.indexOf(platform) > -1) {
                let args = ''; for (let i = 2; i < argv.length; i++) { args += argv[i] + ' '; } args = args.trim();
                let username; username = args;
                let statsUrl = 'http://api.cschaefer.me/discord/trn.codbo4.php'.concat('?username=' + username).concat('&platform=' + platform);
                fetch(statsUrl).then((res) => res.json()).then((data) => {
                    if (data.status == 'error') {
                        msg.edit(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "BO4STATS_NOT_FOUND"));
                        return;
                    }
                    let fields = [];
                    let userName = data.user.username;
                    let generalLabels = [
                        '**Level:**',
                        '**Prestige:**',
                        '**Kills:**',
                        '**Deaths:**'
                    ];
                    let generalKeys = [
                        'level',
                        'prestige',
                        'kills',
                        'deaths'
                    ];
                    let generalString = '';
                    generalKeys.forEach((key, index, array) => {
                        let fieldName = generalLabels[index];
                        let fieldData = data.stats[key];
                        let field = fieldName + ' ' + fieldData;
                        generalString += field + "\n";
                    });
                    generalString += '**K/D:** ' + parseFloat(data.stats['kills']/data.stats['deaths']).toFixed(2);
                    
                    let matchLabels = [
                        '**Matches:**',
                        '**Wins:**',
                        '**Losses:**',
                        '**Time Played:**'
                    ];
                    let matchKeys = [
                        'gamesplayed',
                        'wins',
                        'losses',
                        'timeplayed'
                    ];
                    let matchString = '';
                    matchKeys.forEach((key, index, array) => {
                        let fieldName = matchLabels[index];
                        let fieldData = data.stats[key];
                        if(key == 'timeplayed') {
                            var sec_num = parseInt(fieldData, 10); // don't forget the second param
                            var hours   = Math.floor(sec_num / 3600);
                            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                            var seconds = sec_num - (hours * 3600) - (minutes * 60);
                        
                            if (hours   < 10) {hours   = "0"+hours;}
                            if (minutes < 10) {minutes = "0"+minutes;}
                            if (seconds < 10) {seconds = "0"+seconds;}
                            fieldData = hours+'h'+minutes+'m'+seconds+'s';
                        }
                        let field = fieldName + ' ' + fieldData;
                        matchString += field + "\n";
                    });
                    matchString += '**Win %:** ' + parseFloat(data.stats['wins']/data.stats['losses']).toFixed(2);
                    
                    fields.push({
                        name: '**__General Stats__**',
                        value: generalString,
                        inline: true
                    });
                    fields.push({
                        name: '**__Match Stats__**',
                        value: matchString,
                        inline: true
                    });
                    
                    let embed = {
                        thumbnail: { url: 'https://api.cschaefer.me/discord/misc/codbo4.png' },
                        color: 0xFF6E03,
                        author: { name: userName.concat(strings.GetString(settings.language, "BO4STATS_TITLE"))},
                        fields: fields,
                        footer: {
                            icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                            text: settings.invite_url },
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