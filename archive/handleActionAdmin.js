/*





ARCHIVED

Not in use





*/

const Discord = require("discord.js");

var handleActionAdmin = function (msg) {
	const adminEmbed = new Discord.RichEmbed()
		.setColor(process.env.embedColour)
		.addField("View/edit list of valid guilds for roles (only for bot internal list, doesn't affect discord available roles):", "!guildlist view\n!guildlist add GUILD\n!guildlist remove GUILD")
		.addField("View/edit list of valid roles (separate from guilds, and is only valid in your current server) (only for bot internal list, doesn't affect discord available roles):", "!rolelist view\n!rolelist add ROLE\n!rolelist remove ROLE");

	msg.channel.send({ embeds: [adminEmbed] });
};
module.exports = handleActionAdmin;
