/*

Handles the "setGuild" action, which allows a user to set their guild in their user data

Details:
- Only valid guilds are supported, which are pulled from the backend API
- Sets the data in the backend database using handleProfEvent (which sends to the API)

*/

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
							let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Updated guild to ${guild} for ${msg.member.displayName}`).setDescription(process.env.pepoG);
							msg.channel.send({ embeds: [message] });
						})
						.catch((error) => {
							logger.info(error);
						});
				} else {
					let message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle("Invalid guild!")
						.setDescription(`Please send one of the following: ${validGuilds.toString()}.\nIf your guild is not in this list, please reach out to ${process.env.adminUserTag}`);
					msg.channel.send({ embeds: [message] });
				}
			})
			.catch((error) => {
				logger.info(error);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
				msg.channel.send({ embeds: [message] });
			});
	} else {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Please include a guild name, eg. !setguild Ruby").setDescription(process.env.pepoG);
		msg.channel.send({ embeds: [message] });
	}
};
module.exports = handleActionSetGuild;
