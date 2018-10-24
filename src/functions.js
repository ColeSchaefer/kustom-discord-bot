const settings = require('../settings.json');
const fetch = require('node-fetch');
const pickRandom = require('pick-random');

module.exports = {
    SendWelcome: function(member, bot) {
        let embed = {
            author: { name: 'Welcome to the Kustom Discord!' },
            color: 0x7289D9,
            fields: [ 
                {
                    name: 'User',
                    value: '<@' + member.user.id + '>',
                    inline: false
                },
                {
                    name: 'Kustom Rules',
                    value: 'Please read the ' + bot.channels.get('499616483219865621') + '.',
                    inline: false
                },
                {
                    name: 'Getting Started',
                    value: 'If you\'re new to Kustom, we recommend checking out ' + bot.channels.get('499636823484661790') + '.',
                    inline: false
                }
            ],
            thumbnail: { url: member.user.avatarURL },
            footer:
            {
                icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                text: settings.invite_url
            },
        };
 		bot.channels.get('461292043243618335').send({embed});
    },
    PostRandomFeaturedPackage: function(tag, bot) {
        let apiUri = 'https://api.cschaefer.me/playstore/search/'.concat(tag).concat('/' + settings.featured_package.search_count);
        fetch(apiUri).then((res) => res.json()).then((entries) => {
            
            let selection = pickRandom(entries, { count: 1 });
            let entryUrl = 'https://api.cschaefer.me/playstore/app/'.concat(selection[0].appId);
            
            fetch(entryUrl).then((res) => res.json()).then((entry) => {
                let entryDesc = entry.description.substr(0, 512).replace(/\*/g, '').trim().concat('..');
                let embed = {
                    color: 0x7289D9,
                    image: { url: entry.preview },
                    author: { name: entry.title },
                    thumbnail: { url: entry.icon },
                    fields: [
                        {
                            name: 'Play Store Link',
                            value: entry.url,
                            inline: false
                        },
                        {
                            name: 'Author',
                            value: entry.developer,
                            inline: false
                        },
                        {
                            name: 'Description',
                            value: entryDesc,
                            inline: false
                        }
                    ],
                    footer:
                    {
                        icon_url: "https://discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
                        text: settings.invite_url
                    },
                    timestamp: new Date()
                };
                bot.channels.get('461292043243618335').send({embed});
            });
        });
    },
    StartRandomFeatureTimer: function(bot) {
    	module.exports.PostRandomFeaturedPackage(settings.featured_package.search_tag, bot);
    	setInterval(function() {
    		module.exports.PostRandomFeaturedPackage(settings.featured_package.search_tag, bot);
    	}, 1000 * 10 * 60 * 24);
    }
};