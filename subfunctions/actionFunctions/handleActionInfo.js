const { EmbedBuilder } = require("discord.js");
const logger = require("./../logger");

var handleActionInfo = function (interaction, isInteraction) {
	logger.info(`User ${interaction.user?.tag || interaction.user?.id} requested bot info`);
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

	if (isInteraction) interaction.reply({ embeds: [infoEmbed] });
	else interaction.channel.send({ embeds: [infoEmbed] });
};
module.exports = handleActionInfo;
