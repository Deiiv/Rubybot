const Discord = require("discord.js");

var handleActionInfo = function(msg) {
	const infoEmbed = new Discord.RichEmbed()
		.setColor(process.env.embedColour)
		.addField("What am I for:", "Various functionality for Dofus in discord :robot:")
		.addField("Version:", process.env.version)
		.addField("Written in:", "Node.Js")
		.addField("Developed by:", process.env.author);

	msg.channel.send(infoEmbed);
};
module.exports = handleActionInfo;