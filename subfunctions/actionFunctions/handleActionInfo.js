const Discord = require("discord.js");

var handleActionInfo = function (msg, interactionBool) {
	const infoEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.setTitle(`Rubybot :robot:`)
		.setDescription("Created for various functionality in discord, including Dofus specific features")
		.addField("Version:", process.env.botversion)
		.addField("Runtime:", process.env.runtime)
		.addField("Hosted at:", process.env.host)
		.addField("Developed by:", process.env.adminUserTag);

	if (interactionBool) msg.reply({ embeds: [infoEmbed] });
	else msg.channel.send({ embeds: [infoEmbed] });
};
module.exports = handleActionInfo;
