/*

Handles the "roll" action, which allows a user to roll a die or combination of dice (using XdY)

Details:
- Input limits are in the environment variables (in .env) and are instantiated in handleOnReady.js 

*/

const Discord = require("discord.js");

var handleActionRoll = function (msg, notAnInteraction) {
	var messageContent = msg.content.split(" ");
	var numbers = [];
	const minX = parseInt(process.env.rollMinX, 10);
	const maxX = parseInt(process.env.rollMaxX, 10);
	const minY = parseInt(process.env.rollMinY, 10);
	const maxY = parseInt(process.env.rollMaxY, 10);
	if (messageContent[1]) {
		let x = messageContent[1].split("d")[0];
		let y = messageContent[1].split("d")[1];

		if (isNaN(x) || x < minX || x > maxX) {
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle("X in !roll XdY must be between " + minX + " and " + maxX)
				.setDescription(":game_die:");
			if (notAnInteraction) msg.channel.send({ embeds: [message] });
			else msg.reply({ embeds: [message] });
		} else if (isNaN(y) || y < minY || y > maxY) {
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle("Y in !roll XdY must be between " + minY + " and " + maxY)
				.setDescription(":game_die:");
			if (notAnInteraction) msg.channel.send({ embeds: [message] });
			else msg.reply({ embeds: [message] });
		} else {
			for (let i = 0; i < x; i++) {
				numbers.push(Math.floor(Math.random() * y) + 1).toString();
			}
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle(":game_die: " + messageContent[1])
				.setDescription(numbers.join(" | "));
			if (notAnInteraction) msg.channel.send({ embeds: [message] });
			else msg.reply({ embeds: [message] });
		}
	} else {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input! Proper usage: !roll XdY").setDescription(":game_die:");
		if (notAnInteraction) msg.channel.send({ embeds: [message] });
		else msg.reply({ embeds: [message] });
	}
};
module.exports = handleActionRoll;
