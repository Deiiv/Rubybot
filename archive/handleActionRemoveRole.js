/*





ARCHIVED

Not in use





*/

const Discord = require("discord.js");
const getValidRoles = require("./subActionFunctions/getValidRoles.js");

var handleActionRemoveRole = function (msg) {
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
		.then((validRoles) => {
			let roleName = msg.content.substring(12);

			if (roleName && validRoles.find((r) => r.toLowerCase() === roleName.toLowerCase())) {
				let role = msg.guild.roles.find((role) => role.name.toLowerCase() === roleName.toLowerCase());
				if (msg.member.roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase())) {
					msg.member
						.removeRole(role)
						.then(() => {
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done!", roleName.toLowerCase() + " role successfully removed " + process.env.peepoHappy);
							msg.channel.send(message);
						})
						.catch((error) => {
							console.log(error);
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
							msg.channel.send(message);
						});
				} else {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("You don't have the " + roleName.toLowerCase() + " role", process.env.monkaThink);
					msg.channel.send(message);
					return;
				}
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid role!", "Please send one of the following: " + validRoles.toString());
				msg.channel.send(message);
			}
		})
		.catch((error) => {
			console.log(error);
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
			msg.channel.send(message);
		});
};
module.exports = handleActionRemoveRole;
