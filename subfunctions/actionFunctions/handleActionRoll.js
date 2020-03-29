const Discord = require("discord.js");

var handleActionRoll = function(msg) {
	var messageContent = msg.content.split(" ");
	var numbers = [];
	const minX = process.env.rollMinX;
	const maxX = process.env.rollMaxX;
	const minY = process.env.rollMinY;
	const maxY = process.env.rollMaxY;
	if (messageContent[1]) {
		let x = messageContent[1].split("d")[0];
		let y = messageContent[1].split("d")[1];

		if (isNaN(x) || x < minX || x > maxX) {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("X in !roll XdY must be between " + minX + " and " + maxX, ":game_die:");
			msg.channel.send(message);
		} else if (isNaN(y) || y < minY || y > maxY) {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Y in !roll XdY must be between " + minY + " and " + maxY, ":game_die:");
			msg.channel.send(message);
		} else {
			for (let i = 0; i < x; i++) {
				numbers.push(Math.floor(Math.random() * y) + 1).toString();
			}

			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField(":game_die: " + messageContent[1], numbers.join(" | "));
			msg.channel.send(message);
		}
	}
};
module.exports = handleActionRoll;
