/*

Handles the "alma"/"almanax" action types, which provides a list of all offerings for a month to the caller

Details:
- Calls an API hosted on AWS through sendToApi
- Provides an instant response to the user
- The full async response is sent through a webhook to the almanax channel once data is pulled
- Flow is: Discord command -> bot (instant reply with no info) -> API -> Lambda -> Discord Webhook (full response with list)

*/

const Discord = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");
const logger = require("./../logger");

var handleActionAlma = function (msg, notAnInteraction) {
	if (notAnInteraction) {
		let messageContent = msg.content.split(" ");
		if (messageContent[1] && messageContent[1].length < 3 && messageContent[1] > 0 && messageContent[1] < 13) {
			let almaChannel = "";
			try {
				almaChannel = msg.member.guild.channels.cache.find((ch) => ch.name.includes("almanax"));
			} catch (err) {
				logger.info(err);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Encountered an error: No Almanax channel found").setDescription(":interrobang:");
				msg.channel.send({ embeds: [message] });
				return;
			}
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle("Sending the request!")
				.setDescription("Please wait a few seconds, the result will be sent as a webhook call in the " + (almaChannel.toString() || "#almanax") + " channel");
			msg.channel.send({ embeds: [message] });

			let guild = msg.member.guild.name;

			let data = {
				month: messageContent[1],
				origin: guild,
			};
			sendToApi(data, "/discordwebhookmonthalma", function (response, error) {
				if (error) {
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
					msg.channel.send({ embeds: [message] });
				} else {
					if (response === "INVALID_ORIGIN") {
						let message = new Discord.MessageEmbed()
							.setColor(process.env.embedColour)
							.setTitle("Unable to send !alma response, this functionality isn't supported in this server")
							.setDescription(process.env.pepeCry);
						msg.channel.send({ embeds: [message] });
					}
				}
			});
		} else {
			let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("Proper usage: !alma MM\nExamples: !alma 4, !alma 11");
			msg.channel.send({ embeds: [message] });
		}
	}
	else {
		// const month = parseInt(msg.options.getString('month'));
		var month = msg.options.getString('month');

		if (month > 0 && month < 13) {
			let almaChannel = "";
			try {
				almaChannel = msg.member.guild.channels.cache.find((ch) => ch.name.includes("almanax"));
			} catch (err) {
				logger.info(err);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Encountered an error: No Almanax channel found").setDescription(":interrobang:");
				msg.reply({ embeds: [message] });
				return;
			}

			let guild = msg.member.guild.name;

			let data = {
				month,
				origin: guild,
			};
			sendToApi(data, "/discordwebhookmonthalma", function (response, error) {
				if (error) {
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
					msg.reply({ embeds: [message], ephemeral: true });
				} else {
					if (response === "INVALID_ORIGIN") {
						let message = new Discord.MessageEmbed()
							.setColor(process.env.embedColour)
							.setTitle("Unable to send /alma response, this functionality isn't supported in this server")
							.setDescription(process.env.pepeCry);
						msg.reply({ embeds: [message], ephemeral: true });
					}
					else {
						let message = new Discord.MessageEmbed()
							.setColor(process.env.embedColour)
							.setTitle("Sending the request!")
							.setDescription("Please wait a few seconds, the result will be sent as a webhook call in the " + (almaChannel.toString() || "#almanax") + " channel");
						msg.reply({ embeds: [message], ephemeral: true });
					}
				}
			});
		} else {
			let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("Proper usage: /alma MM\nExamples: /alma 4, /alma 11");
			msg.reply({ embeds: [message], ephemeral: true });
		}
	}
};
module.exports = handleActionAlma;
