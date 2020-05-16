const Discord = require("discord.js");
const handleProfEvent = require("./actionFunctions/subActionFunctions/handleProfEvent.js");

var handleMessageReaction = function (reaction, user, type) {
	// ignore invalid messages
	if (!user) return;
	if (user.bot) return;
	if (!reaction.message.channel.guild) return;
	if (reaction.message.channel.guild != "Deiv's Dev Corner" && reaction.message.channel.guild != "Ruby") return;

	let reactionName = reaction.emoji.name;
	reactionName = reactionName.replace("_role", "");

	if (reaction.message.channel.name === "information" || reaction.message.channel.name === "roles") {
		if (type === "add") {
			// asking to add but already have, ignore
			if (reaction.message.guild.member(user).roles.find((r) => r.name.toLowerCase() === reactionName.toLowerCase())) {
				console.log(`Role ${reactionName} already set for user ${user.username}`);
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done adding role!", reactionName + " role successfully set in the Ruby discord server");
				user.send(message);
				// if the role is "ruby" then udpate user in db with ruby as guild
				if (reactionName.toLowerCase() === "ruby") {
					const member = reaction.message.guild.members.find((m) => m.id === user.id);
					let params = {
						username: member.displayName,
						userid: user.id,
						action: "updateuser",
						guild: "Ruby",
					};
					handleProfEvent(params)
						.then(() => {
							console.log("Done updating user in db");
						})
						.catch((error) => {
							console.log(error);
						});
				}
			} else {
				let role = reaction.message.guild.roles.find((role) => role.name.toLowerCase() === reactionName.toLowerCase());
				if (!role) {
					console.log(`Invalid role reaction : ${reactionName}`);
					return;
				}
				reaction.message.guild
					.member(user)
					.addRole(role)
					.then(() => {
						console.log(`Set role ${reactionName} to user ${user.username}`);

						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done adding role!", reactionName + " role successfully set in the Ruby discord server");
						user.send(message);

						// if the role is "ruby" then udpate user in db with ruby as guild
						if (reactionName.toLowerCase() === "ruby") {
							const member = reaction.message.guild.members.find((m) => m.id === user.id);
							let params = {
								username: member.displayName,
								userid: user.id,
								action: "updateuser",
								guild: "Ruby",
							};
							handleProfEvent(params)
								.then(() => {
									console.log("Done updating user in db");
								})
								.catch((error) => {
									console.log(error);
								});
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		} else if (type === "remove") {
			// asking to remove but it's already gone, ignore
			if (!reaction.message.guild.member(user).roles.find((r) => r.name.toLowerCase() === reactionName.toLowerCase())) {
				console.log(`Role ${reactionName} already removed from user ${user.username}, ignoring`);
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done removing role!", reactionName + " role successfully removed in the Ruby discord server");
				user.send(message);
			} else {
				let role = reaction.message.guild.roles.find((role) => role.name.toLowerCase() === reactionName.toLowerCase());
				if (!role) {
					console.log(`Invalid role reaction : ${reactionName}`);
					return;
				}
				reaction.message.guild
					.member(user)
					.removeRole(role)
					.then(() => {
						console.log(`Removed role ${reactionName} from user ${user.username}`);
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done removing role!", reactionName + " role successfully removed in the Ruby discord server");
						user.send(message);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	} else return;
};
module.exports = handleMessageReaction;
