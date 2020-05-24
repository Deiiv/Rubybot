const Discord = require("discord.js");

var handleActionRoll = function (msg) {
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
			msg.channel.send(message);
		} else if (isNaN(y) || y < minY || y > maxY) {
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle("Y in !roll XdY must be between " + minY + " and " + maxY)
				.setDescription(":game_die:");
			msg.channel.send(message);
		} else {
			for (let i = 0; i < x; i++) {
				numbers.push(Math.floor(Math.random() * y) + 1).toString();
			}
			let message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle(":game_die: " + messageContent[1])
				.setDescription(numbers.join(" | "));
			msg.channel.send(message);
		}
	} else {
		let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input! Proper usage: !roll XdY").setDescription(":game_die:");
		msg.channel.send(message);
	}
};
module.exports = handleActionRoll;
