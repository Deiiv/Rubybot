const Discord = require("discord.js");
const handleProfEvent = require("./actionFunctions/subActionFunctions/handleProfEvent.js");
const logger = require("./logger");

var handleMessageReaction = async (reaction, user, type) => {
	// ignore invalid messages
	if (!user) return;
	if (user.bot) return;
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			logger.info("Something went wrong when fetching the message:");
			logger.error(error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (!reaction.message.channel.guild) return;
	var serverName = reaction.message.channel.guild.name;
	if (serverName != "Deiv's Dev Corner" && serverName != "Ruby" && serverName != "Armonia") return;

	let reactionName = reaction.emoji.name;
	reactionName = reactionName.replace("_role", "");

	if (reaction.message.channel.name === "information" || reaction.message.channel.name === "roles") {
		logger.info(`Reaction ${reactionName} Type ${type} User ${user.username} UserId ${user} | Getting current user roles`);
		reaction.message.guild.members
			.fetch(user.id)
			.then((guildMember) => {
				var userRoles = guildMember.roles.cache;
				logger.info("Got current user roles : " + Array.from(userRoles.mapValues((role) => role.name).values()).toString());
				try {
					if (type === "add") {
						// asking to add but already have, ignore
						if (userRoles.find((r) => r.name.toLowerCase() === reactionName.toLowerCase())) {
							logger.info(`Role ${reactionName} already set for user ${user.username}`);
							let message = new Discord.MessageEmbed()
								.setColor(process.env.embedColour)
								.setTitle("Done adding role!")
								.setDescription(`${reactionName} role successfully added in the ${serverName} discord server for your user (${user.username})`);
							user.send({ embeds: [message] });

							// if the role is "ruby" then udpate user in db with ruby as guild
							if (reactionName.toLowerCase() === "ruby") {
								let params = {
									username: guildMember.displayName,
									userid: user.id,
									action: "updateuser",
									guild: "Ruby",
								};
								handleProfEvent(params)
									.then(() => {
										logger.info("Done updating user in db");
									})
									.catch((error) => {
										logger.error(error);
									});
							}
						} else {
							let role = reaction.message.guild.roles.cache.find((role) => role.name.toLowerCase() === reactionName.toLowerCase());
							if (!role) {
								logger.info(`Invalid role reaction : ${reactionName}`);
								return;
							}
							guildMember.roles.add(role)
								.then(() => {
									logger.info(`Added role ${reactionName} to user ${user.username}`);

									let message = new Discord.MessageEmbed()
										.setColor(process.env.embedColour)
										.setTitle("Done adding role!")
										.setDescription(`${reactionName} role successfully added in the ${serverName} discord server for your user (${user.username})`);
									user.send({ embeds: [message] });


									// if the role is "ruby" then udpate user in db with ruby as guild
									if (reactionName.toLowerCase() === "ruby") {
										let params = {
											username: guildMember.displayName,
											userid: user.id,
											action: "updateuser",
											guild: "Ruby",
										};
										handleProfEvent(params)
											.then(() => {
												logger.info("Done updating user in db");
											})
											.catch((error) => {
												logger.error(error);
											});
									}
								})
								.catch((error) => {
									logger.error(error);
								});
						}
					} else if (type === "remove") {
						// asking to remove but it's already gone, ignore
						if (!userRoles.find((r) => r.name.toLowerCase() === reactionName.toLowerCase())) {
							logger.info(`Role ${reactionName} already removed from user ${user.username}, ignoring`);
							let message = new Discord.MessageEmbed()
								.setColor(process.env.embedColour)
								.setTitle("Done removing role!")
								.setDescription(`${reactionName} role successfully removed in the ${serverName} discord server for your user (${user.username})`);
							user.send({ embeds: [message] });
						} else {
							let role = reaction.message.guild.roles.cache.find((role) => role.name.toLowerCase() === reactionName.toLowerCase());
							if (!role) {
								logger.info(`Invalid role reaction : ${reactionName}`);
								return;
							}
							guildMember.roles.remove(role)
								.then(() => {
									logger.info(`Removed role ${reactionName} from user ${user.username}`);
									let message = new Discord.MessageEmbed()
										.setColor(process.env.embedColour)
										.setTitle("Done removing role!")
										.setDescription(`${reactionName} role successfully removed in the ${serverName} discord server for your user (${user.username})`);
									user.send({ embeds: [message] });
								})
								.catch((error) => {
									logger.error(error);
								});
						}
					}
				} catch (err) {
					logger.info("Error when adding/removing role");
					logger.error(err);
				}
			})
			.catch((err) => {
				logger.info("Error at members.fetch()");
				logger.error(err);
			});
	} else return;
};
module.exports = handleMessageReaction;
