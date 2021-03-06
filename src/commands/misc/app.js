const settings = require('../../../settings.json');
const strings = require('../../strings.js');
const fetch = require('node-fetch');

let Command = {
    Name: ['app'],
    Description: 'Show a preview of a Google Play Store application.',
    RequiredArguments: ['Package ID'],
    commandCallback: function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        if (argv[1]) {
            let apiUri = 'https://api.cschaefer.me/playstore/app/'.concat(argv[1]);
            fetch(apiUri).then((res) => res.json()).then((entry) => {
                let entryDesc = entry.description.substr(0, 512).replace(/\*/g, '').trim().concat('..');
                let entryUrl = 'https://play.google.com/store/apps/details?id='.concat(entry.appId);
                let embed = {
                    url: entryUrl,
                    color: parseInt('0x' + entry.color.replace('#', ''), 16),
                    image: { url: entry.preview },
                    author: { name: entry.title },
                    thumbnail: { url: entry.icon },
                    fields: [{
                            name: strings.GetString(settings.language, "APP_PLAYSTORE_LINK"),
                            value: entryUrl,
                            inline: false
                        }, {
                            name: strings.GetString(settings.language, "APP_AUTHOR"),
                            value: entry.developer,
                            inline: false
                        }, {
                            name: strings.GetString(settings.language, "APP_DESCRIPTION"),
                            value: entryDesc,
                            inline: false
                        }],
                    footer: {
                        icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                        text: settings.invite_url },
                    timestamp: new Date()
                };
                message.channel.send({ embed });
            });
        }
    }
};
module.exports = Command;