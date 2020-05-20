const Discord = require("discord.js");
const getValidGuilds = require("./subActionFunctions/getValidGuilds.js");
const handleProfEvent = require("./subActionFunctions/handleProfEvent.js");
const logger = require("./../logger");

var handleActionSetGuild = function (msg) {
	let guild = msg.content.substring(10);
	if (guild && guild.length > 0) {
		getValidGuilds()
			.then((validGuilds) => {
				if (validGuilds.includes(guild)) {
					let params = {
						username: msg.member.displayName,
						userid: msg.author.id,
						action: "updateuser",
						guild: guild,
					};
					handleProfEvent(params)
						.then(() => {
							logger.info("Done updating user in db");
							let message = new Discord.MessageEmbed().setColor(process.env.embedColour).addField("Updated guild to " + guild + " for " + msg.member.displayName, process.env.pepoG);
							msg.channel.send(message);
						})
						.catch((error) => {
							logger.info(error);
						});
				} else {
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).addField("Invalid guild!", "Please send one of the following: " + validGuilds.toString() + ".\nIf your guild is not in this list, please reach out to " + process.env.adminUserTag);
					msg.channel.send(message);
				}
			})
			.catch((error) => {
				logger.info(error);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
				msg.channel.send(message);
			});
	} else {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour).addField("Please include a guild name, eg. !setguild Ruby", process.env.pepoG);
		msg.channel.send(message);
	}
};
module.exports = handleActionSetGuild;
