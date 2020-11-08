const Discord = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");

var handleActionAlma = function (msg) {
	let messageContent = msg.content.split(" ");
	if (messageContent[1] && messageContent[1].length < 3 && messageContent[1] > 0 && messageContent[1] < 13) {
		let almaChannel = "";
		try {
			almaChannel = msg.member.guild.channels.find((ch) => ch.name.includes("almanax"));
		} catch (err) {
			console.log(err);
			let message = new Discord.RichEmbed()
				.setColor(process.env.embedColour)
				.addField("Encountered an error: " + err.message, "Make sure you call this command from inside a server (not through PM's)");
			msg.channel.send(message);
			return;
		}
		let message = new Discord.RichEmbed()
			.setColor(process.env.embedColour)
			.addField("Sending the request!", "Please wait a few seconds, the result will be sent as a webhook call in the " + (almaChannel.toString() || "#almanax") + " channel");
		msg.channel.send(message);
		let guild = msg.member.guild.name;

		let data = {
			month: messageContent[1],
			origin: guild,
		};
		sendToApi(data, "/discordwebhookmonthalma", function (response, error) {
			if (error) {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
				msg.channel.send(message);
			} else {
				if (response === "INVALID_ORIGIN") {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("This functionality isn't supported in this server", process.env.pepeCry);
					msg.channel.send(message);
				}
			}
		});
	} else {
		let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input!", "Proper usage: !alma MM\nExamples: !alma 4, !alma 11");
		msg.channel.send(message);
	}
};
module.exports = handleActionAlma;
