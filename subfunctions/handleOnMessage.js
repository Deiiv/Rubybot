const Discord = require("discord.js");
const logger = require("./logger");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAdd = require("./actionFunctions/handleActionAdd.js");
const handleActionContact = require("./actionFunctions/handleActionContact.js");
const handleActionPortals = require("./actionFunctions/handleActionPortals.js");
const validCommands = [
	"!info",
	"!help",
	"!roll",
	"!alma",
	"!view",
	"!setguild",
	"!add",
	"!contact",
	"!portals",
	"!portal",
];

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	if (msg.channel.name === "honey-pot" && !msg.member.permissions.has("ADMINISTRATOR")) {
		let adminChannel = msg.guild.channels.cache.find((ch) => ch.name === "discord-admins");
		var message = new Discord.MessageEmbed()
			.setColor(process.env.embedColour)
			.setTitle(`Honey pot ban triggered`)
			.setDescription(
				`The following user will now be been banned and messages from the past 24 hours will be deleted:\n\n${msg.member} | ${msg.author.tag} | ${msg.member.displayName} | ${msg.author.id}\n\nMessage content:\n\n${msg.content}`
			);
		adminChannel.send(message);
		msg.member
			.ban({
				days: 1,
				reason: "Caught in the honey pot, see discord-admins message for more info",
			})
			.then((bannedUser) => {
				logger.info(`Successfully banned user: ${msg.author.tag} (ID: ${msg.author.id})`);
				var message = new Discord.MessageEmbed()
					.setColor(process.env.embedColour)
					.setTitle(`Successfully banned user caught in the honey pot`)
					.setDescription(`Successfully banned user: ${msg.author.tag} (ID: ${msg.author.id})`);
				adminChannel.send(message);
				return;
			})
			.catch((error) => {
				logger.info(`Failed to ban user: ${error.message}`);
				logger.info(error);
				var message = new Discord.MessageEmbed()
					.setColor(process.env.embedColour)
					.setTitle(`FAILED to ban user!`)
					.setDescription(
						`The following user has been caught in the honey pot but could NOT be banned:\n\n${msg.member} | ${msg.member.displayName} | ${msg.author.id}\n\nError:\n\n${error.message}`
					);
				adminChannel.send(message);
				return;
			});
	}

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
			var message = new Discord.MessageEmbed()
				.setColor(process.env.embedColour)
				.setTitle(`Wrong channel! ${process.env.monkaO}`)
				.setDescription(text);
			msg.channel.send(message);
		}
	}
};
module.exports = handleOnMessage;
