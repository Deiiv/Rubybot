const Discord = require("discord.js");
const getValidGuilds = require("./subActionFunctions/getValidGuilds.js");

var handleActionSetRole = function(msg) {
	let guild = "Ruby";
	try {
		guild = msg.member.guild.name;
	} catch (err) {
		console.log(err);
		let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + err.message, "Make sure you call this command from inside a server (not through PM's)");
		msg.channel.send(message);
		return;
	}
	getValidRoles(guild)
		.then(validRoles => {
			let roleName = msg.content.substring(9);

			if (roleName && validRoles.find(r => r.toLowerCase() === roleName.toLowerCase())) {
				if (msg.member.roles.find(r => r.name.toLowerCase() === roleName.toLowerCase())) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("You already have the " + roleName.toLowerCase() + " role", process.env.monkaThink);
					msg.channel.send(message);
					return;
				}

				let role = msg.guild.roles.find(role => role.name.toLowerCase() === roleName.toLowerCase());
				if (!role) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Role " + roleName.toLowerCase() + " not found", ":interrobang:");
					msg.channel.send(message);
				} else {
					msg.member
						.addRole(role)
						.then(() => {
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done!", roleName.toLowerCase() + " role successfully set " + process.env.peepoHappy);
							msg.channel.send(message);
						})
						.catch(error => {
							console.log(error);
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
							msg.channel.send(message);
						});
				}
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid role!", "Please send one of the following: " + validRoles.toString());
				msg.channel.send(message);
			}
		})
		.catch(error => {
			console.log(error);
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
			msg.channel.send(message);
		});
};
module.exports = handleActionSetRole;
