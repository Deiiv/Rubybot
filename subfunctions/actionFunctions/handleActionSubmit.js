const Discord = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");

var handleActionSubmit = function(msg) {
	if (msg.guild === null) {
		if (msg.content.length < 9) {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input! Please include a message", "View proper usage by calling !help");
			msg.channel.send(message);
		} else if (msg.content.length > 1024) {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Your message is too long!", "Please shorten your message, you can also send multiple messages instead of one.");
			msg.channel.send(message);
		} else {
			let message = {
				message: msg.content.substring(8),
				discordid: msg.author.username + "#" + msg.author.discriminator,
				alliance: "true"
			};
			sendToApi(message, "member-message", function(response, error) {
				if (error) {
					return reject(error);
				} else {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done! Your message has been sent to the alliance leadership", process.env.peepoHappy);
					msg.channel.send(message);
				}
			});
		}
	} else {
		let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Sorry, can't send your message!", "This command can only be used in private messages (pm me, the bot " + process.env.peepoHappy + ")");
		msg.channel.send(message);
	}
};
module.exports = handleActionSubmit;
