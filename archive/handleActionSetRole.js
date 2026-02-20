/*





ARCHIVED

Not in use







const Discord = require("discord.js");
const getValidRoles = require("./subActionFunctions/getValidRoles.js");

var handleActionSetRole = function (msg) {
	let guild = "Ruby";
	try {
		guild = msg.member.guild.name;
	} catch (err) {
		console.log(err);
		let message = new Discord.RichEmbed().setColor(process.env.embedColour)
			.addFields(
				{ name: `Encountered an error: ${err.message}`, value: 'Make sure you call this command from inside a server (not through PM\'s)' },
			);
		msg.channel.send({ embeds: [message] });
		return;
	}
	getValidRoles(guild)
		.then((validRoles) => {
			let roleName = msg.content.substring(9);

			if (roleName && validRoles.find((r) => r.toLowerCase() === roleName.toLowerCase())) {
				if (msg.member.roles.find((r) => r.name.toLowerCase() === roleName.toLowerCase())) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour)
						.addFields(
							{ name: `You already have the ${roleName.toLowerCase()} role`, value: process.env.monkaThink },
						);
					msg.channel.send({ embeds: [message] });
					return;
				}

				let role = msg.guild.roles.find((role) => role.name.toLowerCase() === roleName.toLowerCase());
				if (!role) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour)
						.addFields(
							{ name: `Role ${roleName.toLowerCase()} not found`, value: ':interrobang:' },
						);
					msg.channel.send({ embeds: [message] });
				} else {
					msg.member
						.addRole(role)
						.then(() => {
							let message = new Discord.RichEmbed().setColor(process.env.embedColour)
								.addFields(
									{ name: 'Done!', value: `${roleName.toLowerCase()} role successfully set ${process.env.peepoHappy}` },
								);
							msg.channel.send({ embeds: [message] });
						})
						.catch((error) => {
							console.log(error);
							let message = new Discord.RichEmbed().setColor(process.env.embedColour)
								.addFields(
									{ name: `Encountered an error: ${error.message}`, value: ':interrobang:' },
								);
							msg.channel.send({ embeds: [message] });
						});
				}
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour)
					.addFields(
						{ name: 'Invalid role!', value: `Please send one of the following: ${validRoles.toString()}` },
					);
				msg.channel.send({ embeds: [message] });
			}
		})
		.catch((error) => {
			console.log(error);
			let message = new Discord.RichEmbed().setColor(process.env.embedColour)
				.addFields(
					{ name: `Encountered an error: ${error.message}`, value: ':interrobang:' },
				);
			msg.channel.send({ embeds: [message] });
		});
};
module.exports = handleActionSetRole;
*/