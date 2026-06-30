const { EmbedBuilder } = require("discord.js");
const logger = require("./../logger");

var handleActionInfo = function (msg, interactionBool) {
	logger.info(`User ${msg.author?.tag || msg.user?.id} requested bot info`);
	const infoEmbed = new EmbedBuilder()
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
