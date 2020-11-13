const Discord = require("discord.js");

var handleActionHelp = function (msg) {
	const helpEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addField(":closed_book: For help with adding and viewing professions:", "!help prof")
		.addField(":calendar_spiral: To view Almanax for a full month:", "!alma MM")
		.addField(
			":blue_circle: For viewing portals:",
			"!portals (shows all portals)\n!portals DIMENSION_NAME OR !portal DIMENSION_NAME (shows specific portal, ex. !portals enu, !portals enurado, !portal enu, !portal enurado)"
		)
		.addField(":mailbox_with_mail: To contact the guild leadership:", "!contact YOUR MESSAGE HERE\nNOTE: This can only be used in direct pm with the bot")
		.addField(":blue_book: For viewing bot information:", "!info")
		.addField(
			":game_die: To roll a die:",
			"!roll XdY\nEx: !roll 1d6\nX must be between " + process.env.rollMinX + " and " + process.env.rollMaxX + "\nY must be between " + process.env.rollMinY + " and " + process.env.rollMaxY
		)
		.addField("For any other issues, reach out to " + process.env.author, process.env.adminUserTag);

	const helpProfEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addField(":tools: To add or update a profession level you have:", "!add PROFESSION LEVEL")
		.addField(":mag_right: To view users with a profession:", "!view PROFESSION\n!view PROFESSION MIN_LEVEL")
		.addField(":eyes: To view your stats:", "!view")
		.addField(":eyes: To view a specific users stats:", "!view user IGN")
		.addField(process.env.pepoG + " To set your guild:", "!setguild GUILD");

	let messageContent = msg.content.split(" ");
	if (messageContent[1] && messageContent[1] === "prof") {
		msg.channel.send(helpProfEmbed);
	} else {
		msg.channel.send(helpEmbed);
	}
};
module.exports = handleActionHelp;
