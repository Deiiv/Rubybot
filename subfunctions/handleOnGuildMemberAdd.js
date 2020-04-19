const Discord = require("discord.js");

var handleOnGuildMemberAdd = function (member) {
	const channel = member.guild.channels.find((ch) => ch.name.includes("welcome"));
	if (!channel) return;

	// let message = "Welcome to the server, <@" + member.id + ">! " + process.env.pepeRuby;
	let message;

	if (member.guild.name === "POP") {
		message = "please set your role with '!setguild Guild' " + process.env.hypers; // + "\nWhere Guild is one of the following:\n" + validGuilds.toString();
	} else if (member.guild.name === "Silk Road") {
		message = "please set your role with '!setguild Silk Road'";
	} else {
		let infoChannel = member.guild.channels.find((ch) => ch.name === "information");
		if (infoChannel) {
			message = "please check out our rules/info and how to set roles here: " + infoChannel.toString() + " " + process.env.pepoG;
		} else {
			message = "please check out our rules/info in the appropriate info channel " + process.env.hypers;
		}
	}

	let welcomeMessageEmbed = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Welcome! " + process.env.pepeRuby, "<@" + member.id + ">, " + message);

	channel.send(welcomeMessageEmbed);
};
module.exports = handleOnGuildMemberAdd;
