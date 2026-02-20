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
const handleActionBackup = require("./actionFunctions/handleActionBackup.js");
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
	"!backup",
];

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	if (msg.channel.name === "honey-pot" && !msg.member.permissions.has("ADMINISTRATOR")) {
		let adminChannel = msg.guild.channels.cache.find((ch) => ch.name === "discord-mods");
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
		if (
			msg.channel.name === "talk-to-rubybot" ||
			msg.channel.name === "professions" ||
			msg.channel.name === "development" ||
			msg.channel.name === "test"
		) {
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
						.setTitle(`This can only be used in direct pm with the bot (me)`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
					break;
				default:
					var message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle(
							`This command either doesn't work here, or you don't have access to it! Type !help for proper usage`
						)
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
					var message = new Discord.MessageEmbed()
						.setColor(process.env.embedColour)
						.setTitle(`Only !contact, !help, !info, and !view will work here`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
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
			msg.channel.send({ embeds: [message] });
		}
	} else {
		/*
		
		add reaction for Phoebe comments

		TODO: move this to it's own function that handles more of these actions for other words,
		making sure it's ordered

		*/
		if (msg.guild.id === "375518646015098893" && msg.content.toLowerCase().indexOf("phoebe") != -1) {
			// only add reaction if the emoji exists in bot memory
			// if (process.env.phoebepog) msg.react(process.env.phoebepog);
			if (process.env.phoepeek) msg.react(process.env.phoepeek);
		}
		if (
			msg.guild.id === "375518646015098893" &&
			(msg.content.toLowerCase() == "cel." ||
				msg.content.toLowerCase() == "cel" ||
				msg.content.toLowerCase().startsWith("cel ") ||
				msg.content.toLowerCase().endsWith(" cel") ||
				msg.content.toLowerCase().endsWith(" cel.") ||
				msg.content.toLowerCase().includes(" cel ") ||
				msg.content.toLowerCase().includes(" cel."))
		) {
			// only add reaction if the emoji exists in bot memory
			// if (process.env.phoebepog) msg.react(process.env.phoebepog);
			if (process.env.celface) msg.react(process.env.celface);
		}
	}
};
module.exports = handleOnMessage;
