const Discord = require("discord.js");

var handleActionInfo = function (msg) {
	const infoEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.setTitle(`Rubybot :robot:`)
		.setDescription("Created for various functionality in discord, including Dofus specific features")
		.addField("Version:", process.env.botversion)
		.addField("Runtime:", process.env.runtime)
		.addField("Hosted on:", process.env.host)
		.addField("Developed by:", process.env.adminUserTag);
	msg.channel.send(infoEmbed);
};
module.exports = handleActionInfo;
