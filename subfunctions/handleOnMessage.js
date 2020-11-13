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
const validCommands = ["!info", "!help", "!roll", "!alma", "!view", "!setguild", "!add", "!contact", "!portals"];

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	if (validCommands.includes(msg.content.split(" ")[0])) {
		if (msg.channel.name === "talk-to-rubybot" || msg.channel.name === "professions") {
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
				// contacts discord admins in guild discord
				case "!contact":
					handleActionContact(msg);
					break;
				// gets current dimension portals
				case "!portals":
					handleActionPortals(msg);
					break;
				case "!portal":
					handleActionPortals(msg);
					break;
				default:
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
