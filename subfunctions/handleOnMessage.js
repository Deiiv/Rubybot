/*

Handles message events (normal text messages)

Details:
- Only valid commands listed here are supported
- Because we now support interactions (see handleOnInteraction.js and deployCommands.js) we have to make sure
the sub functions reply correctly. To do this, we pass another field "notAnInteraction" to old functions so
that they can reply using the old way
- Also handles reactToKeywords, which allows the bot to react to specific key words
- Once interactions are fully tested, this will be deprecated and scoped down to only handle functions such as reactToKeywords

*/

const Discord = require("discord.js");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAdd = require("./actionFunctions/handleActionAdd.js");
const handleActionContact = require("./actionFunctions/handleActionContact.js");
const handleActionPortals = require("./actionFunctions/handleActionPortals.js");
const handleActionBackup = require("./actionFunctions/handleActionBackup.js");
const reactToKeywords = require("./actionFunctions/reactToKeywords.js");
const validCommands = ["!info", "!help", "!roll", "!alma", "!view", "!setguild", "!add", "!contact", "!portals", "!portal", "!backup"];

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	if (validCommands.includes(msg.content.split(" ")[0])) {
		if (msg.channel.name === "talk-to-rubybot" || msg.channel.name === "professions" || msg.channel.name === "development" || msg.channel.name === "test") {
			switch (msg.content.split(" ")[0]) {
				// view bot info
				case "!info":
					handleActionInfo(msg, true);
					break;
				// view help menu
				case "!help":
					handleActionHelp(msg, true);
					break;
				// rolls dice
				case "!roll":
					handleActionRoll(msg, true);
					break;
				// alma monthly call
				case "!alma":
					handleActionAlma(msg, true);
					break;
				// view profession details
				case "!view":
					handleActionView(msg, true);
					break;
				// set guild in db for user
				case "!setguild":
					handleActionSetGuild(msg, true);
					break;
				// add prof actions
				case "!add":
					handleActionAdd(msg, true);
					break;
				// gets current dimension portals
				case "!portals":
				case "!portal":
					handleActionPortals(msg, true);
					break;
				case "!contact":
					var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`This can only be used in direct pm with the bot (me)`).setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
					break;
				default:
					var message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle(`This command either doesn't work here, or you don't have access to it! Type !help for proper usage`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
					break;
			}
		}
		// admin commands
		else if (msg.channel.name === "discord-admins") {
			switch (msg.content.split(" ")[0]) {
				// discord server backup
				case "!backup":
					handleActionBackup(msg, true);
					break;
				default:
					break;
			}
		}
		// private message
		else if (msg.guild === null) {
			switch (msg.content.split(" ")[0]) {
				// contacts discord admins in guild discord
				case "!contact":
					handleActionContact(msg, true);
					break;
				// view help menu
				case "!help":
					handleActionHelp(msg, true);
					break;
				// view profession details
				case "!view":
					handleActionView(msg, true);
					break;
				// view bot info
				case "!info":
					handleActionInfo(msg, true);
					break;
				default:
					var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Only !contact, !help, !info, and !view will work here`).setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
					break;
			}
		} else {
			let talkToRubybotChannel = msg.guild.channels.cache.find((ch) => ch.name === "talk-to-rubybot");
			var text = "Please create a channel named 'talk-to-rubybot' to send your commands.";
			if (talkToRubybotChannel) text = `Please send your commands in ${talkToRubybotChannel.toString()}`;
			var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Wrong channel! ${process.env.monkaO}`).setDescription(text);
			msg.channel.send({ embeds: [message] });
		}
	}
	else {
		// add a reaction for specific keywords
		reactToKeywords(msg);
	}
};
module.exports = handleOnMessage;
