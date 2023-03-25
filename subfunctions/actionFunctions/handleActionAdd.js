const Discord = require("discord.js");
const handleProfEvent = require("./subActionFunctions/handleProfEvent.js");
const profList = [
	"Alchemist",
	"Farmer",
	"Fisherman",
	"Hunter",
	"Lumberjack",
	"Miner",
	"Artificer",
	"Carver",
	"Handyman",
	"Jeweller",
	"Shoemaker",
	"Smith",
	"Tailor",
	"Craftmagus",
	"Carvmagus",
	"Costumagus",
	"Jewelmagus",
	"Shoemagus",
	"Smithmagus",
];
const logger = require("./../logger");

var handleActionAdd = function (msg) {
	let messageContent = msg.content.split(" ");

	if (messageContent.length < 3) {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour)
			.addFields(
				{ name: 'Invalid input!', value: 'View proper usage by calling !help prof' },
			);
		msg.channel.send({ embeds: [message] });
		return;
	}

	if (messageContent[1] && messageContent[2]) {
		messageContent[1] = messageContent[1].toLowerCase();
		let prof = messageContent[1].charAt(0).toUpperCase() + messageContent[1].slice(1);
		if (profList.includes(prof)) {
			let level = Math.floor(messageContent[2]).toString();
			if (level >= 1 && level <= 200) {
				let username = msg.member.displayName;
				let userid = msg.author.id;

				let params = {
					username: username,
					userid: userid,
					action: "updateprof",
					prof: prof,
					level: level,
				};

				handleProfEvent(params)
					.then(() => {
						logger.info("Done updating user in db");
						let message = new Discord.MessageEmbed().setColor(process.env.embedColour)
							.addFields(
								{ name: `Profession ${prof} set to level ${level} for user ${username}`, value: process.env.peepoHappy },
							);
						msg.channel.send({ embeds: [message] });
					})
					.catch((error) => {
						logger.error(error);
					});
			} else {
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour)
					.addFields(
						{ name: 'Invalid profession level!', value: 'Level must be between 1-200 (inclusive)' },
					);
				msg.channel.send({ embeds: [message] });
			}
		} else {
			let message = new Discord.MessageEmbed().setColor(process.env.embedColour)
				.addFields(
					{ name: 'Invalid profession! List of valid professions:', value: profList.toString() },
				);
			msg.channel.send({ embeds: [message] });
		}
	} else {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour)
			.addFields(
				{ name: 'Invalid input!', value: 'View proper usage by calling !help prof' },
			);
		msg.channel.send({ embeds: [message] });
	}
};
module.exports = handleActionAdd;
