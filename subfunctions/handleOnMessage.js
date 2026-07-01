const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fetch = require("node-fetch");
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

	if (
		msg.channel.name === "honey-pot" &&
		msg.channel.id === process.env.honeyPotChannelID &&
		!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)
	) {
		let adminChannel = msg.guild.channels.cache.find((ch) => ch.name === "discord-mods");
		let publicChannel = msg.guild.channels.cache.find((ch) => ch.name === "🏠welcome");

		let mentionsList =
			msg.mentions.users.size > 0 ? msg.mentions.users.map((u) => `${u.tag} (${u.id})`).join("\n") : "None";

		let attachmentsList = "None";
		// send admin alert immediately without files to avoid delaying ban
		if (msg.attachments.size > 0) {
			// list names only (no URLs) in the initial alert to avoid leaking attachments twice
			attachmentsList = msg.attachments.map((att) => `${att.name || "attachment"} (${(att.size / 1024).toFixed(1)} KB)`).join("\n");
		}
		// Prepare and send initial admin alert quickly
		var message = new EmbedBuilder()
			.setColor(process.env.embedColour)
			.setTitle(`Honey pot ban triggered`)
			.setDescription(
				`The following user will now be been banned and messages from the past 24 hours will be deleted:\n\n${msg.member} | ${msg.author.tag} | ${msg.member.displayName} | ${msg.author.id}`
			)
			.addFields(
				{ name: "Message Content", value: msg.content || "(no text content)" },
				{ name: "Mentions", value: mentionsList },
				{ name: "Attachments", value: attachmentsList || "None" }
			);
		if (adminChannel) {
			adminChannel.send({ embeds: [message] }).catch((err) => {
				logger.info(`Failed to send honey pot admin message: ${err.message}`);
				logger.info(err);
			});
		} else logger.info("Admin channel not found for honey pot alert");

		// If attachments are small enough, download them in background and re-upload as a followup to admin channel
		if (msg.attachments.size > 0 && adminChannel) {
			const SINGLE_MAX = 8 * 1024 * 1024; // 8 MB per file
			const TOTAL_MAX = 8 * 1024 * 1024; // 8 MB total upload
			const downloads = Array.from(
				msg.attachments.map((att) => {
					if (att.size > SINGLE_MAX) {
						logger.info(`Skipping download for ${att.url}: size ${att.size} > ${SINGLE_MAX}`);
						return Promise.resolve(null);
					}
					return fetch(att.url)
						.then((res) => res.buffer())
						.then((buf) => ({ buf, name: att.name || "file", size: buf.length }))
						.catch((err) => {
							logger.info(`Failed to download attachment ${att.url}: ${err.message}`);
							logger.info(err);
							return null;
						});
				})
			);
			Promise.all(downloads)
				.then((results) => {
					const available = results.filter(Boolean);
					let total = available.reduce((s, r) => s + r.size, 0);
					if (total > TOTAL_MAX) {
						// trim files until under limit
						available.sort((a, b) => b.size - a.size);
						while (total > TOTAL_MAX && available.length) {
							total -= available[0].size;
							available.shift();
						}
					}
					if (available.length === 0) {
						logger.info("No attachments available for upload (too large or failed)");
						return;
					}
					const files = available.map((a) => ({ attachment: a.buf, name: a.name }));
					const attachEmbed = new EmbedBuilder()
						.setColor(process.env.embedColour)
						.setTitle(`Honey pot: attachments (uploaded)`)
						.setDescription(`Attachments from a honey-pot message by ${msg.author} (${msg.author.tag})`)
						.addFields(
							{ name: "Author ID", value: `${msg.author.id}`, inline: true },
							{ name: "Channel", value: msg.channel ? msg.channel.toString() : "(unknown)", inline: true },
							{
								name: "Files included",
								value: available.map((a) => `${a.name} — ${(a.size / 1024).toFixed(1)} KB`).join("\n"),
							}
						);
					// Add links for ALL original attachments so the follow-up is the comprehensive summary
					const linksField = msg.attachments.map((att) => `[${att.name || att.url}](${att.url})`).join("\n");
					attachEmbed.addFields({ name: "Attachment Links", value: linksField });
					adminChannel.send({ embeds: [attachEmbed], files }).catch((err) => {
						logger.info(`Failed to upload attachments to admin channel: ${err.message}`);
						logger.info(err);
					});
				})
				.catch((err) => {
					logger.info(`Attachment background download failed: ${err.message}`);
					logger.info(err);
				});
		}

		// attempt to delete the offending message (non-fatal)
		msg.delete().catch((err) => {
			logger.info(`Failed to delete honey pot message: ${err.message}`);
			logger.info(err);
		});

		// attempt to ban (do not wait for attachment uploads)
		msg.member
			.ban({
				deleteMessageSeconds: 60 * 60 * 24,
				reason: "Caught in the honey pot, see discord-admins message for more info",
			})
			.then(() => {
				logger.info(`Successfully banned user: ${msg.author.tag} (ID: ${msg.author.id})`);
				var messageSuccess = new EmbedBuilder()
					.setColor(process.env.embedColour)
					.setTitle(`Successfully banned user caught in the honey pot`)
					.setDescription(`Successfully banned user: ${msg.author.tag} (ID: ${msg.author.id})`);
				if (adminChannel) adminChannel.send({ embeds: [messageSuccess] });

				var messagePublicSuccess = new EmbedBuilder()
					.setColor(process.env.embedColour)
					.setTitle(`🚨 LADIES AND GENTLEMEN... WE GOT 'EM 🚨`)
					.setDescription(
						`${msg.author} (${msg.author.tag}) has been caught RED-HANDED spamming in the honey pot and has been PERMANENTLY BANNED from the server 🍯🔨⚡🚫\\n\\nThe spam era has ENDED 🔚☠️ Ruby stays UNDEFEATED ${process.env.ruby}👑💎🏆💪🦅🚀`
					);
				if (publicChannel) publicChannel.send({ embeds: [messagePublicSuccess] });
				return;
			})
			.catch((error) => {
				logger.info(`Failed to ban user: ${error.message}`);
				logger.info(error);
				var messageError = new EmbedBuilder()
					.setColor(process.env.embedColour)
					.setTitle(`FAILED to ban user!`)
					.setDescription(
						`The following user has been caught in the honey pot but could NOT be banned:\n\n${msg.member} | ${msg.member.displayName} | ${msg.author.id}\n\nError:\n\n${error.message}`
					);
				if (adminChannel) adminChannel.send({ embeds: [messageError] });
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
					var message = new EmbedBuilder()
						.setColor(process.env.embedColour)
						.setTitle(`This can only be used in direct pm with the bot (me)`)
						.setDescription(process.env.peepoHappy);
					msg.channel.send({ embeds: [message] });
					break;
				default:
					var message = new EmbedBuilder()
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
					var message = new EmbedBuilder()
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
			var message = new EmbedBuilder()
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
		if (msg.guild.id === "375518646015098893" && msg.content.toLowerCase().indexOf("what") != -1) {
			// only add reaction if the emoji exists in bot memory
			if (process.env.jackieWhat) msg.react(process.env.jackieWhat);
		}
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
			if (process.env.celface) msg.react(process.env.celface);
		}
	}
};
module.exports = handleOnMessage;
