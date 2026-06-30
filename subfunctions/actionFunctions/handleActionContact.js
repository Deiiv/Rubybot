const { EmbedBuilder } = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");
const logger = require("./../logger");

var handleActionContact = function (msg) {
	logger.info(`User ${msg.author.tag} invoked !contact (guild: ${msg.guild ? msg.guild.id : 'DM'})`);
	if (msg.guild === null) {
		if (msg.content.length < 10) {
			let message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Invalid input! Please include a message").setDescription("View proper usage by calling !help");
			msg.channel.send({ embeds: [message] });
		} else if (msg.content.length > 1024) {
			let message = new EmbedBuilder()
				.setColor(process.env.embedColour)
				.setTitle("Your message is too long!")
				.setDescription("Please shorten your message, you can also send multiple messages instead of one.");
			msg.channel.send({ embeds: [message] });
		} else {
			let message = {
				message: msg.content.substring(9),
				discordid: msg.author.username + "#" + msg.author.discriminator,
			};
			sendToApi(message, "/member-message", function (response, error) {
				if (error) {
					logger.error(`Failed to send member message: ${error.message}`);
					logger.error(error);
					let message = new EmbedBuilder().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
					msg.channel.send({ embeds: [message] });
				} else {
					logger.info(`Member message sent by ${msg.author.tag}`);
					let message = new EmbedBuilder()
						.setColor(process.env.embedColour)
						.setTitle("Done! Your message has been sent to the guild leadership")
						.setDescription("You will receive a reply from someone shortly " + process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
				}
			});
		}
	} else {
		let message = new EmbedBuilder()
			.setColor(process.env.embedColour)
			.setTitle("Sorry, can't send your message!")
			.setDescription("This command can only be used in private messages (pm me, the bot " + process.env.peepoHappy + ")");
		msg.channel.send({ embeds: [message] });
	}
};
module.exports = handleActionContact;
