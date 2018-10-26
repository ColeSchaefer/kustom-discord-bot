const settings = require('../../../settings.json');
const strings = require('../../strings');

let Command = {
    Name: ['unmute'],
    Description: 'Unmute a user in the Discord server.',
    RequiredArguments: ['User Mention'],
    commandCallback: async function(message, bot) {
	    let argv = message.content.substring(settings.prefix.length).split(' ');
        let userTo = message.guild.member(message.mentions.users.first());
        
        if (argv[1] && userTo) {
            if (message.member.hasPermission('MANAGE_MESSAGES')) { 
    		    
    		    // Find the Muted Role
    		    var role = message.guild.roles.find((x) => x.name === 'Muted');
    			// Create it if it doesn't exist
    			if (!role) {
    				try {
    				    // Create the Muted role
    					role = await message.guild.createRole({
    						name: 'Muted',
    						color: '#000000',
    						permissions: []
    					});
    				} catch(ex) {
    					console.log(ex.stack);
    				}
    			}
    			
				// Set the role's permissions
				message.guild.channels.forEach(async (channel, id) => {
					await channel.overwritePermissions(role, {
						SEND_MESSAGES: false,
						ADD_REACTIONS: false,
						CONNECT: false,
						SPEAK: false
					});
				});
				
    			if (!userTo.roles.has(role.id)) return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "USER_ALREADY_UNMUTED"));
    			if (userTo.id === message.author.id) return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "USER_CANNOT_MUTE_SELF"));
    			if (userTo.highestRole.position >= message.member.highestRole.Position) return message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "USER_CANNOT_MUTE_SAME_ROLE_OR_HIGHER"));
    			
    			await userTo.removeRole(role);
    			
    			message.channel.send(message.guild.member(message.author) + ' → ' + strings.GetString(settings.language, "USER_HAS_BEEN_UNMUTED"));
    		}
        }
    }
};
module.exports = Command;