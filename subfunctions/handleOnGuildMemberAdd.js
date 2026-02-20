const Discord = require("discord.js");

var handleOnGuildMemberAdd = function (member) {
	const channel = member.guild.channels.cache.find((ch) => ch.name.includes("welcome"));
	if (!channel) return;

	// let message = "Welcome to the server, <@" + member.id + ">! " + process.env.pepeRuby;
	let message;

	if (member.guild.name === "Ruby") {
		let infoChannel = member.guild.channels.cache.find((ch) => ch.name === "information");
		if (infoChannel) {
			message =
				"please head over to " +
				infoChannel.toString() +
				" to read our rules/info and set the Ruby role (required for viewing channels) " +
				process.env.pogpeach;
		} else {
			message = "please check out our rules/info in the appropriate info channel " + process.env.hypers;
		}
	} else {
		let infoChannel = member.guild.channels.cache.find((ch) => ch.name === "information");
		if (infoChannel) {
			message = "please head over to " + infoChannel.toString() + " to read our rules/info";
		} else {
			message = "please check out our rules/info in the appropriate info channel";
		}
	}

	let welcomeMessageEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.setTitle(`Welcome ${member.displayName}! ` + process.env.pepeRuby)
		.setDescription(`${member}, ` + message);

	channel.send(welcomeMessageEmbed);
};
module.exports = handleOnGuildMemberAdd;
