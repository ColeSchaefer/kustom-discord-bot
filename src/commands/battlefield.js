const settings = require('../../settings.json');
const strings = require('../strings');
const fetch = require('node-fetch');

let Command = {
    Name: 'bf1',
    Description: 'Retrieve the Battlefield 1 stats of any player.',
    RequiredArguments: ['Platform', 'Player Name'],
    commandCallback: function(message, bot) {
        
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let platforms = ['ps4', 'psn', 'xb1', 'xbl', 'pc', 'origin'];
        let platform = argv[1];
        
        message.channel.send('Searching..').then((msg) => {
            if (platforms.indexOf(platform) > -1) {
                let args = ''; for (let i = 2; i < argv.length; i++) { args += argv[i] + ' '; } args = args.trim();
                let username; username = args;
                let statsUrl = 'http://api.cschaefer.me/discord/tracker.php'.concat('?title=' + argv[0]).concat('&username=' + username).concat('&platform=' + platform);
                fetch(statsUrl).then((res) => res.json()).then((data) => {
                    if (!data.successful) {
                        msg.edit(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "BF1STATS_NOT_FOUND"));
                        return;
                    }
                    let fields = [];
                    let generalArr = [
                        '**Rank:** ' + data.result.rank.number,
                        '**Skill:** ' + data.result.skill,
                        '**Kills:** ' + data.result.kills,
                        '**Deaths:** ' + data.result.deaths
                    ];
                    let generalString = generalArr.join("\n");
                    
                    let totalMatches = (data.result.wins + data.result.losses);
                    
                    var sec_num = parseInt(data.result.timePlayed, 10); // don't forget the second param
                    var hours   = Math.floor(sec_num / 3600);
                    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                    var seconds = sec_num - (hours * 3600) - (minutes * 60);
                
                    if (hours   < 10) {hours   = "0"+hours;}
                    if (minutes < 10) {minutes = "0"+minutes;}
                    if (seconds < 10) {seconds = "0"+seconds;}
                    
                    let matchArr = [
                        '**Matches:** ' + totalMatches,
                        '**Wins:** ' + data.result.wins,
                        '**Losses:** ' + data.result.losses,
                        '**Time Played:** ' + hours+'h'+minutes+'m'+seconds+'s'
                    ];
                    let matchString = matchArr.join("\n");
                    
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
                        thumbnail: { url: data.result.rank.imageUrl.replace('[BB_PREFIX]', data.bbPrefix) },
                        color: 0xF17F1A,
                        author: { name: data.profile.displayName.concat(strings.GetString(settings.language, "BF1STATS_TITLE"))},
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

    // var sec_num = parseInt(this, 10); // don't forget the second param
    // var hours   = Math.floor(sec_num / 3600);
    // var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    // var seconds = sec_num - (hours * 3600) - (minutes * 60);

    // if (hours   < 10) {hours   = "0"+hours;}
    // if (minutes < 10) {minutes = "0"+minutes;}
    // if (seconds < 10) {seconds = "0"+seconds;}
    // return hours+':'+minutes+':'+seconds;