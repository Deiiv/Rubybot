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
const validCommands = ["!info", "!help", "!roll", "!alma", "!view", "!setguild", "!add", "!contact", "!portals", "!portal", "!backup"];

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	if (validCommands.includes(msg.content.split(" ")[0])) {
		if (msg.channel.name === "talk-to-rubybot" || msg.channel.name === "professions" || msg.channel.name === "development" || msg.channel.name === "test") {
			switch (msg.content.split(" ")[0]) {
				// view bot info
				case "!info":
					handleActionInfo(msg);
					break;
				// view help menu
				case "!help":
					handleActionHelp(msg);
					break;
				// rolls dice
				case "!roll":
					handleActionRoll(msg);
					break;
				// alma monthly call
				case "!alma":
					handleActionAlma(msg);
					break;
				// view profession details
				case "!view":
					handleActionView(msg);
					break;
				// set guild in db for user
				case "!setguild":
					handleActionSetGuild(msg);
					break;
				// add prof actions
				case "!add":
					handleActionAdd(msg);
					break;
				// gets current dimension portals
				case "!portals":
				case "!portal":
					handleActionPortals(msg);
					break;
				case "!contact":
					var message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle(`This can only be used in direct pm with the bot (me ${process.env.peepoHappy})`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send(message);
					break;
				default:
					var message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle(`This command either doesn't work here, or you don't have access to it! Type !help for proper usage`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send(message);
					break;
			}
		}
		// admin commands
		else if (msg.channel.name === "discord-admins") {
			switch (msg.content.split(" ")[0]) {
				// discord server backup
				case "!backup":
					handleActionBackup(msg);
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
					handleActionContact(msg);
					break;
				// view help menu
				case "!help":
					handleActionHelp(msg);
					break;
				// view profession details
				case "!view":
					handleActionView(msg);
					break;
				// view bot info
				case "!info":
					handleActionInfo(msg);
					break;
				default:
					var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Only !contact, !help, !info, and !view will work here`).setDescription(process.env.peepoHappy);
					msg.channel.send(message);
					break;
			}
		} else {
			let talkToRubybotChannel = msg.guild.channels.cache.find((ch) => ch.name === "talk-to-rubybot");
			var text = "Please create a channel named 'talk-to-rubybot' to send your commands.";
			if (talkToRubybotChannel) text = `Please send your commands in ${talkToRubybotChannel.toString()}`;
			var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Wrong channel! ${process.env.monkaO}`).setDescription(text);
			msg.channel.send(message);
		}
	}
};
module.exports = handleOnMessage;
