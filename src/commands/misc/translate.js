const settings = require('../../../settings.json');
const strings = require('../../strings');
const translate = require('google-translate-api');

let Command = {
    Name: ['translate'],
    Description: 'Translate a message from one language to another.',
    RequiredArguments: ['Language, Message'],
    commandCallback: function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
	    
	    let lang = argv[1];
        let toTrans = ''; for (let i = 2; i < argv.length; i++) { toTrans += argv[i] + ' '; } toTrans = toTrans.trim();
        
        message.channel.send('Translating..').then(function(msg) {
			translate(toTrans, { to: lang }).then((res) => {
				msg.edit(res.text);
			}).catch((err) => {
				console.error(err);
			});
		});
    }
};
module.exports = Command;