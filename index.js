require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const embedColour = "#FEC6C7";
var monkaThink, hypers, pepeRuby, pepeCry, peepoHappy, pepoG;
const profList = ["Alchemist", "Farmer", "Fisherman", "Hunter", "Lumberjack", "Miner", "Artificer", "Carver", "Handyman", "Jeweller", "Shoemaker", "Smith", "Tailor", "Craftmagus", "Carvmagus", "Costumagus", "Jewelmagus", "Shoemagus", "Smithmagus"];
const infoEmbed = new Discord.RichEmbed()
	.setColor(embedColour)
	.addField("What am I for:", "Various functionality for Dofus in discord :robot:")
	.addField("Version:", "6.13")
	.addField("Written in:", "Node.Js")
	.addField("Developed by:", "Deiv");

const helpEmbed = new Discord.RichEmbed()
	.setColor(embedColour)
	.addField(":closed_book: For help with adding and viewing professions:", "!help prof")
	.addField(":calendar_spiral: To view Almanax for a full month:", "!alma MM")
	.addField(":mailbox_with_mail: To contact the guild leadership:", "!contact YOUR MESSAGE HERE\nNOTE: This can only be used in direct pm with the bot")
	.addField(":mailbox_with_mail: To contact the alliance leadership:", "!submit YOUR MESSAGE HERE\nNOTE: This can only be used in direct pm with the bot")
	.addField(":blue_book: For viewing bot information:", "!info")
	.addField(":pencil2: To set your guild as a role:", "!setguild GUILD")
	.addField(":pencil2: To set a misc. role:", "!setrole ROLE")
	.addField(":closed_lock_with_key: For admin actions:", "!admin");

const adminEmbed = new Discord.RichEmbed()
	.setColor(embedColour)
	.addField("View/edit list of valid guilds for roles (only for bot internal list, doesn't affect discord available roles):", "!guildlist view\n!guildlist add GUILD\n!guildlist remove GUILD")
	.addField("View/edit list of valid roles (separate from guilds, and is only valid in your current server) (only for bot internal list, doesn't affect discord available roles):", "!rolelist view\n!rolelist add ROLE\n!rolelist remove ROLE");

// prof help
const helpProfEmbed = new Discord.RichEmbed()
	.setColor(embedColour)
	.addField(":tools: To add or update a profession level you have:", "!add PROFESSION LEVEL")
	.addField(":mag_right: To view users with a profession:", "!view PROFESSION\n!view PROFESSION MIN_LEVEL")
	.addField(":eyes: To view your stats:", "!view")
	.addField(":eyes: To view a specific users stats:", "!view user IGN");
// .addField(":book: To view how many users are registered:", "!users")

/*

when no guild in entry that was created

add nickname instead of username (maybe setnickname command)


!portals

*/

client.on("ready", () => {
	console.log('Logged in as:');
	console.log(client.user.username + " " + client.user.id);
	console.log('\nConnected to the following servers:');
	client.guilds.forEach(function(guild) {
		console.log(guild.name + " " + guild.id);
		// if(guild.name === "x") guild.leave();
	});
	console.log('------------------------------\n');

	hypers = client.emojis.find(emoji => emoji.name === "hypers") || "";
	pepeRuby = client.emojis.find(emoji => emoji.name === "pepeRuby") || "";
	monkaThink = client.emojis.find(emoji => emoji.name === "monkaThink") || "";
	pepeCry = client.emojis.find(emoji => emoji.name === "pepeCry") || "";
	peepoHappy = client.emojis.find(emoji => emoji.name === "peepoHappy") || "";
	pepoG = client.emojis.find(emoji => emoji.name === "pepoG") || "";
});

//new member event
client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'welcome');
	if (!channel) return;

	// let message = "Welcome to the server, <@" + member.id + ">! " + pepeRuby;
	let message;

	if (member.guild.name === "POP") {
		message = "please set your role with '!setguild Guild' " + hypers; // + "\nWhere Guild is one of the following:\n" + validGuilds.toString();
	}
	else if (member.guild.name === "Silk Road") {
		message = "please set your role with '!setguild Silk Road'";
	}
	else {
		let infoChannel = member.guild.channels.find(ch => ch.name === 'information');
		let bioChannel = member.guild.channels.find(ch => ch.name === 'bio');
		if (infoChannel && bioChannel) {
			message = "please check out our rules/info: " + infoChannel.toString() + " " + pepoG +
				"\nMeet our members over at: " + bioChannel.toString() + " " + peepoHappy +
				"\nSet your guild with: '!setguild Ruby' " + pepeRuby +
				"\nAnd set some fun roles (changes your colour) with '!setrole Lemon' (or Blueberry/Strawberry/etc. " + hypers;
		}
		else {
			message = "please check out our rules/info in the appropriate info channel " + hypers;
		}
	}

	let welcomeMessageEmbed = new Discord.RichEmbed()
		.setColor(embedColour)
		.addField("Welcome! " + pepeRuby, "<@" + member.id + ">, " + message);

	channel.send(welcomeMessageEmbed);
});

//message event
client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith('!setguild')) {
		getValidGuilds()
			.then(validGuilds => {
				let guild = msg.content.substring(10);
				var text = "";

				if (guild && validGuilds.includes(guild)) {
					if (msg.member.roles.find(r => r.name === guild)) {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('You already have the ' + guild + ' role, but I\'ll set the entry again for !view', monkaThink);
						msg.channel.send(message);
						let params = {
							username: msg.member.displayName,
							userid: msg.author.id,
							action: "updateuser",
							guild: guild
						};
						handleProfEvent(params)
							.then(() => {
								console.log("Done updating user in db");
							})
							.catch(error => {
								console.log(error);
							});
						return;
					}

					let shortList = validGuilds.filter(item => item !== guild);
					shortList.forEach(function(guildRole) {
						if (msg.member.roles.find(r => r.name === guildRole)) {
							let oldRole = msg.guild.roles.find(role => role.name === guildRole);
							msg.member.removeRole(oldRole)
								.then(() => {
									text += "Removed previous role for guild " + guildRole + " " + pepeCry + "\n";
								})
								.catch(error => {
									console.log(error);
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Encountered an error: ' + error.message, ":interrobang:");
									msg.channel.send(message);
								});
						}
					});

					let role = msg.guild.roles.find(role => role.name === guild);
					if (!role) {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField("Role for guild " + guild + " not found", ":interrobang:");
						msg.channel.send(message);
					}
					else {
						msg.member.addRole(role)
							.then(() => {
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField("Done!", text + 'Role set for guild ' + guild + " " + peepoHappy);
								msg.channel.send(message);
								let params = {
									username: msg.member.displayName,
									userid: msg.author.id,
									action: "updateuser",
									guild: guild
								};
								handleProfEvent(params)
									.then(() => {
										console.log("Done updating user in db");
									})
									.catch(error => {
										console.log(error);
									});
							})
							.catch(error => {
								console.log(error);
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField('Encountered an error: ' + error.message, ":interrobang:");
								msg.channel.send(message);
							});
					}
				}
				else {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField("Invalid guild!", "Please send one of the following: " + validGuilds.toString());
					msg.channel.send(message);
				}
			})
			.catch(error => {
				console.log(error);
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Encountered an error: ' + error.message, ":interrobang:");
				msg.channel.send(message);
			});
	}

	//info
	if (msg.content.startsWith('!info')) {
		msg.channel.send(infoEmbed);
	}

	//help menu
	if (msg.content.startsWith('!help')) {
		let messageContent = msg.content.split(" ");
		if (messageContent[1] && messageContent[1] === "prof") {
			msg.channel.send(helpProfEmbed);
		}
		else {
			msg.channel.send(helpEmbed);
		}
	}

	//admin menu
	if (msg.content.startsWith('!admin')) {
		msg.channel.send(adminEmbed);
	}

	//alma monthly call
	if (msg.content.startsWith('!alma')) {
		let messageContent = msg.content.split(" ");
		if (messageContent[1] && messageContent[1].length < 3 && messageContent[1] > 0 && messageContent[1] < 13) {
			let almaChannel = "";
			try {
				almaChannel = msg.member.guild.channels.find(ch => ch.name === 'almanax');
			}
			catch (err) {
				console.log(err);
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
				msg.channel.send(message);
				return;
			}
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Sending the request!', "Please wait a few seconds, the result will be sent as a webhook call in the " + (almaChannel.toString() || "#almanax") + " channel");
			msg.channel.send(message);
			let guild = msg.member.guild.name;
			sendToAlmaApi(messageContent[1], guild, function(response, error) {
				if (error) {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Encountered an error: ' + error.message, ":interrobang:");
					msg.channel.send(message);
				}
				else {
					if (response === "INVALID_ORIGIN") {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField("This functionality isn't supported in this server", pepeCry);
						msg.channel.send(message);
					}
				}
			});
		}
		else {
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Invalid input!', "Proper usage: !alma MM\nExamples: !alma 4, !alma 11");
			msg.channel.send(message);
		}
	}

	//managing guild list
	if (msg.content.startsWith('!guildlist')) {
		//check that a valid user is calling the command
		if (msg.member.roles.find(r => r.name === "BotAdmin")) {
			let messageContent = msg.content.split(" ");
			//get current list of valid guilds
			if (messageContent[1] === "view") {
				getValidGuilds()
					.then(validGuilds => {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Current list of valid guilds:', validGuilds.toString());
						msg.channel.send(message);
					})
					.catch(error => {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			}
			else if (messageContent[1] === "add") {
				let guildToAdd = messageContent.splice(2).join(" ");
				console.log("New Guild : " + guildToAdd);

				getValidGuilds()
					.then(validGuilds => {
						if (validGuilds.includes(guildToAdd)) {
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField('Guild ' + guildToAdd + ' is already in guild list', monkaThink);
							msg.channel.send(message);
						}
						else {
							console.log("Old guildList : " + validGuilds.toString());
							validGuilds.push(guildToAdd);
							console.log("New guildList : " + validGuilds.toString());

							let message = {
								"action": "update",
								"value": validGuilds.toString(),
								"type": "guilds"
							};
							sendToGeneralApi(message, "/admin/guildlist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Encountered an error: ' + error.message, ":interrobang:");
									msg.channel.send(message);
								}
								else {
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Guild list updated, new list: ', validGuilds.toString());
									msg.channel.send(message);
								}
							});
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});

			}
			else if (messageContent[1] === "remove") {
				let guildToRemove = messageContent.splice(2).join(" ");
				console.log("Removing Guild : " + guildToRemove);

				getValidGuilds()
					.then(validGuilds => {
						if (validGuilds.includes(guildToRemove)) {
							console.log("Old guildList : " + validGuilds.toString());
							validGuilds.splice(validGuilds.indexOf(guildToRemove), 1);
							console.log("New guildList : " + validGuilds.toString());

							let message = {
								"action": "update",
								"value": validGuilds.toString(),
								"type": "guilds"
							};
							sendToGeneralApi(message, "/admin/guildlist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Encountered an error: ' + error.message, ":interrobang:");
									msg.channel.send(message);
								}
								else {
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Guild list updated, new list: ', validGuilds.toString());
									msg.channel.send(message);
								}
							});
						}
						else {
							console.log("Guild trying to remove is not in current list");
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField("The guild " + guildToRemove + " is not in the current list, so can't remove it.", "" + pepoG);
							msg.channel.send(message);
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			}
			else {
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input!', "View proper usage by calling !admin");
				msg.channel.send(message);
			}
		}
		else {
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Only members with the correct role can use this option', pepoG);
			msg.channel.send(message);
		}
	}

	//view prof
	if (msg.content.startsWith('!view')) {
		let messageContent = msg.content.split(" ");
		if (messageContent.length === 1) {
			let userid = msg.author.id;
			let params = {
				userid: userid,
				action: "view"
			};
			handleProfEvent(params)
				.then(response => {
					let data = JSON.parse(response);
					if (!data.guild) {
						data.guild = "None (use !setguild to set this value)";
					}
					if (data.profList && data.profList.length < 1) {
						data.profList = "None (add a prof with !add, see !prof help for details)";
					}

					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField(":shield: " + data.username + "'s Guild:", data.guild)
						.addField(":hammer_pick: " + data.username + "'s Professions:", data.profList);
					msg.channel.send(message);
				})
				.catch(error => {
					console.log(error);
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Encountered an error: ' + error.message, ":interrobang:");
					msg.channel.send(message);
				});
		}
		//view user by IGN !view user IGN
		else if (messageContent[1].toUpperCase() === "USER") {
			if (messageContent[2]) {
				let username = messageContent[2];
				let params = {
					username: username,
					action: "view"
				};
				handleProfEvent(params)
					.then(response => {
						if (response === "NONE") {
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField("User " + username + " doesn't exist in our records!", pepoG);
							msg.channel.send(message);
						}
						else {
							let data = JSON.parse(response);
							if (!data.guild) {
								data.guild = "None (use !setguild to set this value)";
							}
							if (data.profList && data.profList.length < 1) {
								data.profList = "None (add a prof with !add, see !prof help for details)";
							}

							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField(":shield: " + username + "'s Guild:", data.guild)
								.addField(":hammer_pick: " + username + "'s Professions:", data.profList);
							msg.channel.send(message);
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			}
			else {
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input!', "View proper usage by calling !help prof");
				msg.channel.send(message);
			}
		}
		//view profs !view prof OR !view prof level
		else {
			if (messageContent[1]) {
				messageContent[1] = messageContent[1].toLowerCase();
				let prof = messageContent[1].charAt(0).toUpperCase() + messageContent[1].slice(1);
				if (profList.includes(prof)) {
					if (messageContent[2] && (messageContent[2] < 1 || messageContent[2] > 200)) {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Invalid input!', "View proper usage by calling !help prof");
						msg.channel.send(message);
						return;
					}

					let level = Math.floor(messageContent[2]);

					let params = {
						action: "getProf",
						prof: prof,
						level: level
					};
					handleProfEvent(params)
						.then(response => {
							var levelMessage = "";
							if (messageContent[2]) {
								levelMessage = " >= " + level;
							}
							if (response === "NONE") {
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField(pepoG + " Users with " + prof + levelMessage, "None!");
								msg.channel.send(message);
							}
							else {
								let data = JSON.parse(response);
								if (data.string === "") {
									data.string = "None!";
								}
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField(pepoG + " List of users with " + prof + " profession" + levelMessage, data.string);
								msg.channel.send(message);
							}
						})
						.catch(error => {
							console.log(error);
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField('Encountered an error: ' + error.message, ":interrobang:");
							msg.channel.send(message);
						});
				}
				else {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Invalid profession! List of valid professions:', profList.toString());
					msg.channel.send(message);
				}
			}
			else {
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input!', "View proper usage by calling !help prof");
				msg.channel.send(message);
			}
		}
	}

	//set role
	if (msg.content.startsWith('!setrole')) {
		let guild = "Ruby";
		try {
			guild = msg.member.guild.name;
		}
		catch (err) {
			console.log(err);
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
			msg.channel.send(message);
			return;
		}
		getValidRoles(guild)
			.then(validRoles => {
				let roleName = msg.content.substring(9);

				if (roleName && validRoles.includes(roleName)) {
					if (msg.member.roles.find(r => r.name === roleName)) {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('You already have the ' + roleName + ' role', monkaThink);
						msg.channel.send(message);
						return;
					}

					let role = msg.guild.roles.find(role => role.name === roleName);
					if (!role) {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField("Role " + roleName + " not found", ":interrobang:");
						msg.channel.send(message);
					}
					else {
						msg.member.addRole(role)
							.then(() => {
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField("Done!", roleName + " role successfully set " + peepoHappy);
								msg.channel.send(message);
							})
							.catch(error => {
								console.log(error);
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField('Encountered an error: ' + error.message, ":interrobang:");
								msg.channel.send(message);
							});
					}
				}
				else {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField("Invalid role!", "Please send one of the following: " + validRoles.toString());
					msg.channel.send(message);
				}
			})
			.catch(error => {
				console.log(error);
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Encountered an error: ' + error.message, ":interrobang:");
				msg.channel.send(message);
			});
	}

	//set role
	if (msg.content.startsWith('!removerole')) {
		let guild = "Ruby";
		try {
			guild = msg.member.guild.name;
		}
		catch (err) {
			console.log(err);
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
			msg.channel.send(message);
			return;
		}
		getValidRoles(guild)
			.then(validRoles => {
				let roleName = msg.content.substring(12);

				if (roleName && validRoles.includes(roleName)) {
					let role = msg.guild.roles.find(role => role.name === roleName);
					if (msg.member.roles.find(r => r.name === roleName)) {
						msg.member.removeRole(role)
							.then(() => {
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField("Done!", roleName + " role successfully removed " + peepoHappy);
								msg.channel.send(message);
							})
							.catch(error => {
								console.log(error);
								let message = new Discord.RichEmbed()
									.setColor(embedColour)
									.addField('Encountered an error: ' + error.message, ":interrobang:");
								msg.channel.send(message);
							});
					}
					else {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('You don\'t have the ' + roleName + ' role', monkaThink);
						msg.channel.send(message);
						return;
					}
				}
				else {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField("Invalid role!", "Please send one of the following: " + validRoles.toString());
					msg.channel.send(message);
				}
			})
			.catch(error => {
				console.log(error);
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Encountered an error: ' + error.message, ":interrobang:");
				msg.channel.send(message);
			});
	}

	//managing role list
	if (msg.content.startsWith('!rolelist')) {
		//check that a valid user is calling the command
		if (msg.member.roles.find(r => r.name === "BotAdmin")) {
			let messageContent = msg.content.split(" ");
			//get current list of valid guilds
			let guild = "Ruby";
			try {
				guild = msg.member.guild.name;
			}
			catch (err) {
				console.log(err);
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
				msg.channel.send(message);
				return;
			}
			if (messageContent[1] === "view") {
				getValidRoles(guild)
					.then(validRoles => {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Current list of valid roles:', validRoles.toString());
						msg.channel.send(message);
					})
					.catch(error => {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			}
			else if (messageContent[1] === "add") {
				let roleToAdd = messageContent.splice(2).join(" ");
				console.log("New Role : " + roleToAdd);
				let guild = "Ruby";
				try {
					guild = msg.member.guild.name;
				}
				catch (err) {
					console.log(err);
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
					msg.channel.send(message);
					return;
				}
				getValidRoles(guild)
					.then(validRoles => {
						if (validRoles.includes(roleToAdd)) {
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField('Role ' + roleToAdd + ' is already in role list', monkaThink);
							msg.channel.send(message);
						}
						else {
							console.log("Old rolesList : " + validRoles.toString());
							validRoles.push(roleToAdd);
							console.log("New rolesList : " + validRoles.toString());

							let message = {
								"action": "update",
								"value": validRoles.toString(),
								"type": "roles",
								"guild": guild
							};
							sendToGeneralApi(message, "/admin/rolelist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Encountered an error: ' + error.message, ":interrobang:");
									msg.channel.send(message);
								}
								else {
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Roles list updated, new list: ', validRoles.toString());
									msg.channel.send(message);
								}
							});
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});

			}
			else if (messageContent[1] === "remove") {
				let roleToRemove = messageContent.splice(2).join(" ");
				console.log("Removing Role : " + roleToRemove);
				let guild = "Ruby";
				try {
					guild = msg.member.guild.name;
				}
				catch (err) {
					console.log(err);
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Encountered an error: ' + err.message, "Make sure you call this command from inside a server (not through PM's)");
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
								"action": "update",
								"value": validRoles.toString(),
								"type": "roles",
								"guild": guild
							};
							sendToGeneralApi(message, "/admin/rolelist", function(response, error) {
								if (error) {
									console.log(error);
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Encountered an error: ' + error.message, ":interrobang:");
									msg.channel.send(message);
								}
								else {
									let message = new Discord.RichEmbed()
										.setColor(embedColour)
										.addField('Roles list updated, new list: ', validRoles.toString());
									msg.channel.send(message);
								}
							});
						}
						else {
							console.log("Role trying to remove is not in current list");
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField("The role " + roleToRemove + " is not in the current list, so can't remove it.", "" + pepoG);
							msg.channel.send(message);
						}
					})
					.catch(error => {
						console.log(error);
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Encountered an error: ' + error.message, ":interrobang:");
						msg.channel.send(message);
					});
			}
			else {
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input!', "View proper usage by calling !admin");
				msg.channel.send(message);
			}
		}
		else {
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Only members with the correct role can use this option', pepoG);
			msg.channel.send(message);
		}
	}

	// add prof actions
	if (msg.content.startsWith('!add')) {
		let messageContent = msg.content.split(" ");

		if (messageContent.length < 3) {
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Invalid input!', "View proper usage by calling !help prof");
			msg.channel.send(message);
			return;
		}

		if (messageContent[1] && messageContent[2]) {
			messageContent[1] = messageContent[1].toLowerCase();
			let prof = messageContent[1].charAt(0).toUpperCase() + messageContent[1].slice(1);
			if (profList.includes(prof)) {
				let level = (Math.floor(messageContent[2])).toString();
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
							let message = new Discord.RichEmbed()
								.setColor(embedColour)
								.addField('Profession ' + prof + ' set to level ' + level + ' for user ' + username, peepoHappy);
							msg.channel.send(message);
						})
						.catch(error => {
							console.log(error);

						});
				}
				else {
					let message = new Discord.RichEmbed()
						.setColor(embedColour)
						.addField('Invalid profession level!', 'Level must be between 1-200 (inclusive)');
					msg.channel.send(message);
				}
			}
			else {
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid profession! List of valid professions:', profList.toString());
				msg.channel.send(message);
			}
		}
		else {
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField('Invalid input!', "View proper usage by calling !help prof");
			msg.channel.send(message);
		}
	}

	//contacts discord admins in guild discord
	if (msg.content.startsWith('!contact')) {
		if(msg.guild === null){
			if(msg.content.length < 10){
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input! Please include a message', "View proper usage by calling !help");
				msg.channel.send(message);
			}
			else if(msg.content.length > 1024){
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Your message is too long!', "Please shorten your message, you can also send multiple messages instead of one.");
				msg.channel.send(message);
			}
			else{
				let message = {
					"message": msg.content.substring(9),
					"discordid": msg.author.username + "#" + msg.author.discriminator
				};
				sendToGeneralApi(message, "member-message", function(response, error) {
					if (error) {
						return reject(error);
					}
					else {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Done! Your message has been sent to the guild leadership', "You will receive a reply from someone shortly " + peepoHappy);
						msg.channel.send(message);
					}
				});
			}
		}
		else{
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField("Sorry, can't send your message!", "This command can only be used in private messages (pm me, the bot " + peepoHappy + ")");
			msg.channel.send(message);
		}
	}

	//contacts discord admins in alliance discord
	if (msg.content.startsWith('!submit')) {
		if(msg.guild === null){
			if(msg.content.length < 10){
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Invalid input! Please include a message', "View proper usage by calling !help");
				msg.channel.send(message);
			}
			else if(msg.content.length > 1024){
				let message = new Discord.RichEmbed()
					.setColor(embedColour)
					.addField('Your message is too long!', "Please shorten your message, you can also send multiple messages instead of one.");
				msg.channel.send(message);
			}
			else{
				let message = {
					"message": msg.content.substring(9),
					"discordid": msg.author.username + "#" + msg.author.discriminator,
					"alliance": "true"
				};
				sendToGeneralApi(message, "member-message", function(response, error) {
					if (error) {
						return reject(error);
					}
					else {
						let message = new Discord.RichEmbed()
							.setColor(embedColour)
							.addField('Done! Your message has been sent to the alliance leadership', peepoHappy);
						msg.channel.send(message);
					}
				});
			}
		}
		else{
			let message = new Discord.RichEmbed()
				.setColor(embedColour)
				.addField("Sorry, can't send your message!", "This command can only be used in private messages (pm me, the bot " + peepoHappy + ")");
			msg.channel.send(message);
		}
	}
});

client.login(process.env.clientkey);

var sendToGeneralApi = function(message, path, callback) {
	let url = process.env.rubybotApi + path;
	let msg = {
		method: 'post',
		body: JSON.stringify(message),
		headers: {
			'Content-Type': 'application/json'
		},
	};
	console.log("Calling url : " + url + " | with message : " + JSON.stringify(msg));
	fetch(url, msg)
		.then(res => res.text())
		.then(data => {
			console.log("Response : " + data);
			let json = JSON.parse(data);
			callback(json.body);
		})
		.catch(err => {
			console.log("Error in fetch");
			console.log(err);
			callback(null, err);
		});
};

var sendToAlmaApi = function(month, origin, callback) {
	let json = {
		month: month,
		origin: origin
	};

	fetch(process.env.almaApi, {
			method: 'post',
			body: JSON.stringify(json),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(res => res.text())
		.then(body => {
			console.log(body);
			callback(body);
		})
		.catch(err => {
			console.log("Error in fetch");
			console.log(err);
			callback(null, err);
		});
};

var getValidGuilds = function() {
	return new Promise((resolve, reject) => {
		let message = {
			"action": "get",
			"type": "guilds"
		};
		sendToGeneralApi(message, "admin/guildlist", function(response, error) {
			if (error) {
				return reject(error);
			}
			else {
				let guildList = response.split(",");
				return resolve(guildList);
			}
		});
	});
};

var getValidRoles = function(guild) {
	return new Promise((resolve, reject) => {
		let message = {
			"action": "get",
			"type": "roles",
			"guild": guild
		};
		sendToGeneralApi(message, "admin/rolelist", function(response, error) {
			if (error) {
				return reject(error);
			}
			else {
				let guildList = response ? response.split(",") : [];
				return resolve(guildList);
			}
		});
	});
};

var handleProfEvent = function(data) {
	return new Promise((resolve, reject) => {
		let message = {
			username: data.username,
			id: data.userid,
			action: data.action,
			prof: data.prof,
			level: data.level || "0",
			guild: data.guild
		};

		sendToGeneralApi(message, "/prof", function(response, error) {
			if (error) {
				return reject(error);
			}
			else {
				return resolve(response);
			}
		});
	});
};