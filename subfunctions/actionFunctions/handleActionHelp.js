const Discord = require("discord.js");

var handleActionHelp = function (msg, interactionBool) {
	const helpEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addFields(
			{ name: ':closed_book: For help with adding and viewing professions:', value: '!help prof' },
			{ name: ':calendar_spiral: To view Almanax for a full month:', value: '!alma MM' },
			{ name: ':blue_circle: For viewing portals:', value: '!portals (shows all portals)\n!portals DIMENSION_NAME OR !portal DIMENSION_NAME (shows specific portal, ex. !portals enu, !portals enurado, !portal enu, !portal enurado)\nNote: default server is Ilyzaelle. For Jahash, add j (ex. !portal enu j, !portals j)' },
			{ name: ':mailbox_with_mail: To contact the guild leadership:', value: '!contact YOUR MESSAGE HERE\nNOTE: This can only be used in direct pm with the bot' },
			{ name: ':blue_book: For viewing bot information:', value: '!info' },
			{ name: ':game_die: To roll a die:', value: `!roll XdY\nEx: !roll 1d6\nX must be between ${process.env.rollMinX} and ${process.env.rollMaxX}\nY must be between ${process.env.rollMinY} and ${process.env.rollMaxY}` },
			{ name: `For any other issues, reach out to ${process.env.author}`, value: process.env.adminUserTag },
		);

	const helpProfEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addFields(
			{ name: ':tools: To add or update a profession level you have:', value: '!add PROFESSION LEVEL' },
			{ name: ':mag_right: To view users with a profession:', value: '!view PROFESSION\n!view PROFESSION MIN_LEVEL' },
			{ name: ':eyes: To view your stats:', value: '!view' },
			{ name: ':eyes: To view a specific users stats:', value: '!view user IGN' },
			{ name: `${process.env.pepoG} To set your guild:`, value: '!setguild GUILD' },
		);

	if (interactionBool) msg.reply({ embeds: [helpEmbed] });
	else {
		let messageContent = msg.content.split(" ");
		if (messageContent[1] && messageContent[1] === "prof") {
			msg.channel.send({ embeds: [helpProfEmbed] });
		} else {
			msg.channel.send({ embeds: [helpEmbed] });
		}
	}
};
module.exports = handleActionHelp;
