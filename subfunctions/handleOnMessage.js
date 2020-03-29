const Discord = require("discord.js");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionAdmin = require("./actionFunctions/handleActionAdmin.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionGuildlist = require("./actionFunctions/handleActionGuildlist.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetRole = require("./actionFunctions/handleActionSetRole.js");
const handleActionRemoveRole = require("./actionFunctions/handleActionRemoveRole.js");

var handleOnMessage = function(msg) {
	if (msg.author.bot) return;

	if (msg.content.startsWith("!info")) handleActionInfo(msg);

	if (msg.content.startsWith("!help")) handleActionHelp(msg);

	if (msg.content.startsWith("!admin")) handleActionAdmin(msg);

	if (msg.content.startsWith("!roll")) handleActionRoll(msg);

	if (msg.content.startsWith("!setguild")) handleActionSetGuild(msg);

	//alma monthly call
	if (msg.content.startsWith("!alma")) handleActionAlma(msg);

	//managing guild list
	if (msg.content.startsWith("!guildlist")) handleActionGuildlist(msg);

	//view prof
	if (msg.content.startsWith("!view")) handleActionView(msg);

	//set role
	if (msg.content.startsWith("!setrole")) handleActionSetRole(msg);

	//set role
	if (msg.content.startsWith("!removerole")) handleActionRemoveRole(msg);

	//managing role list
	if (msg.content.startsWith("!rolelist")) {
		//check that a valid user is calling the command
		if (msg.member.roles.find(r => r.name === "BotAdmin")) {
			let messageContent = msg.content.split(" ");
			//get current list of valid guilds
			let guild = "Ruby";
			try {
				guild = msg.member.guild.name;
			} catch (err) {
				console.log(err);
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + err.message, "Make sure you call this command from inside a server (not through PM's)");
				msg.channel.send(message);
				return;
			}
			if (messageContent[1] === "view") {
				getValidRoles(guild)
					.then(validRoles => {
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Current list of valid roles:", validRoles.toString());
						msg.channel.send(message);
					})
					.catch(error => {
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			} else if (messageContent[1] === "add") {
				let roleToAdd = messageContent.splice(2).join(" ");
				console.log("New Role : " + roleToAdd);
				let guild = "Ruby";
				try {
					guild = msg.member.guild.name;
				} catch (err) {
					console.log(err);
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + err.message, "Make sure you call this command from inside a server (not through PM's)");
					msg.channel.send(message);
					return;
				}
				getValidRoles(guild)
					.then(validRoles => {
						if (validRoles.includes(roleToAdd)) {
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Role " + roleToAdd + " is already in role list", process.env.monkaThink);
							msg.channel.send(message);
						} else {
							console.log("Old rolesList : " + validRoles.toString());
							validRoles.push(roleToAdd);
							console.log("New rolesList : " + validRoles.toString());

							let message = {
								action: "update",
								value: validRoles.toString(),
								type: "roles",
								guild: guild
							};
							sendToGeneralApi(message, "/admin/rolelist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
									msg.channel.send(message);
								} else {
									let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Roles list updated, new list: ", validRoles.toString());
									msg.channel.send(message);
								}
							});
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			} else if (messageContent[1] === "remove") {
				let roleToRemove = messageContent.splice(2).join(" ");
				console.log("Removing Role : " + roleToRemove);
				let guild = "Ruby";
				try {
					guild = msg.member.guild.name;
				} catch (err) {
					console.log(err);
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + err.message, "Make sure you call this command from inside a server (not through PM's)");
					msg.channel.send(message);
					return;
				}
				getValidRoles(guild)
					.then(validRoles => {
						if (validRoles.includes(roleToRemove)) {
							console.log("Old roleList : " + validRoles.toString());
							validRoles.splice(validRoles.indexOf(roleToRemove), 1);
							console.log("New roleList : " + validRoles.toString());

							let message = {
								action: "update",
								value: validRoles.toString(),
								type: "roles",
								guild: guild
							};
							sendToGeneralApi(message, "/admin/rolelist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
									msg.channel.send(message);
								} else {
									let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Roles list updated, new list: ", validRoles.toString());
									msg.channel.send(message);
								}
							});
						} else {
							console.log("Role trying to remove is not in current list");
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("The role " + roleToRemove + " is not in the current list, so can't remove it.", "" + process.env.pepoG);
							msg.channel.send(message);
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input!", "View proper usage by calling !admin");
				msg.channel.send(message);
			}
		} else {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Only members with the correct role can use this option", process.env.pepoG);
			msg.channel.send(message);
		}
	}

	// add prof actions
	if (msg.content.startsWith("!add")) {
		let messageContent = msg.content.split(" ");

		if (messageContent.length < 3) {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input!", "View proper usage by calling !help prof");
			msg.channel.send(message);
			return;
		}

		if (messageContent[1] && messageContent[2]) {
			messageContent[1] = messageContent[1].toLowerCase();
			let prof = messageContent[1].charAt(0).toUpperCase() + messageContent[1].slice(1);
			if (profList.includes(prof)) {
				let level = Math.floor(messageContent[2]).toString();
				if (level >= 1 && level <= 200) {
					let username = msg.member.displayName;
					let userid = msg.author.id;

					let params = {
						username: username,
						userid: userid,
						action: "updateprof",
						prof: prof,
						level: level
					};

					handleProfEvent(params)
						.then(() => {
							console.log("Done updating user in db");
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Profession " + prof + " set to level " + level + " for user " + username, process.env.peepoHappy);
							msg.channel.send(message);
						})
						.catch(error => {
							console.log(error);
						});
				} else {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid profession level!", "Level must be between 1-200 (inclusive)");
					msg.channel.send(message);
				}
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid profession! List of valid professions:", profList.toString());
				msg.channel.send(message);
			}
		} else {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input!", "View proper usage by calling !help prof");
			msg.channel.send(message);
		}
	}

	//contacts discord admins in guild discord
	if (msg.content.startsWith("!contact")) {
		if (msg.guild === null) {
			if (msg.content.length < 10) {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input! Please include a message", "View proper usage by calling !help");
				msg.channel.send(message);
			} else if (msg.content.length > 1024) {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Your message is too long!", "Please shorten your message, you can also send multiple messages instead of one.");
				msg.channel.send(message);
			} else {
				let message = {
					message: msg.content.substring(9),
					discordid: msg.author.username + "#" + msg.author.discriminator
				};
				sendToGeneralApi(message, "member-message", function(response, error) {
					if (error) {
						return reject(error);
					} else {
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done! Your message has been sent to the guild leadership", "You will receive a reply from someone shortly " + process.env.peepoHappy);
						msg.channel.send(message);
					}
				});
			}
		} else {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Sorry, can't send your message!", "This command can only be used in private messages (pm me, the bot " + process.env.peepoHappy + ")");
			msg.channel.send(message);
		}
	}

	//contacts discord admins in alliance discord
	if (msg.content.startsWith("!submit")) {
		if (msg.guild === null) {
			if (msg.content.length < 9) {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid input! Please include a message", "View proper usage by calling !help");
				msg.channel.send(message);
			} else if (msg.content.length > 1024) {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Your message is too long!", "Please shorten your message, you can also send multiple messages instead of one.");
				msg.channel.send(message);
			} else {
				let message = {
					message: msg.content.substring(8),
					discordid: msg.author.username + "#" + msg.author.discriminator,
					alliance: "true"
				};
				sendToGeneralApi(message, "member-message", function(response, error) {
					if (error) {
						return reject(error);
					} else {
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done! Your message has been sent to the alliance leadership", process.env.peepoHappy);
						msg.channel.send(message);
					}
				});
			}
		} else {
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Sorry, can't send your message!", "This command can only be used in private messages (pm me, the bot " + process.env.peepoHappy + ")");
			msg.channel.send(message);
		}
	}
};
module.exports = handleOnMessage;
