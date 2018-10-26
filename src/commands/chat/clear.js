const settings = require('../../../settings.json');

let Command = {
    Name: ['clear', 'clean', 'erase', 'purge'],
    Description: 'Clear the current channel of X messages.',
    RequiredArguments: ['# Messages'],
    commandCallback: function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        async function purgeMessages(count) {			
			if (message.member.hasPermission('MANAGE_MESSAGES')) {
			    await message.delete();
			    if (count > 100) count = 100;
			    message.channel.fetchMessages({ limit: count }).then((messages) => {
    				let messagesArr = messages.array();
    				for (let i = 0; i < messagesArr.length; i++) {
    					messagesArr[i].delete();
    				}
    			});
			}
        }
        purgeMessages(argv[1]);
    }
};
module.exports = Command;