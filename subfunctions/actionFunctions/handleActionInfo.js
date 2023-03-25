const Discord = require("discord.js");

var handleActionInfo = function (msg, interactionBool) {
	const infoEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.setTitle(`Rubybot :robot:`)
		.setDescription("Created for various functionality in discord, including Dofus specific features")
		.addFields(
			{ name: 'Version:', value: process.env.botversion },
			{ name: 'Runtime:', value: process.env.runtime },
			{ name: 'Hosted at:', value: process.env.host, inline: true },
			{ name: 'Developed by:', value: process.env.adminUserTag, inline: true },
		);

	if (interactionBool) msg.reply({ embeds: [infoEmbed] });
	else msg.channel.send({ embeds: [infoEmbed] });
};
module.exports = handleActionInfo;
