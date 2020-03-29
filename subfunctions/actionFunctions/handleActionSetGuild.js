const Discord = require("discord.js");
const getValidGuilds = require("./subActionFunctions/getValidGuilds.js");

var handleActionSetGuild = function(msg) {
	getValidGuilds()
		.then(validGuilds => {
			let guild = msg.content.substring(10);
			var text = "";

			if (guild && validGuilds.includes(guild)) {
				if (msg.member.roles.find(r => r.name === guild)) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("You already have the " + guild + " role, but I'll set the entry again for !view", process.env.monkaThink);
					msg.channel.send(message);

					//if in alliance disc (Ally role exists) set it
					let allyRole = msg.guild.roles.find(role => role.name === "Ally");
					if (allyRole) {
						console.log("Setting Ally role");
						msg.member
							.addRole(allyRole)
							.then(() => {
								console.log("Ally role set");
							})
							.catch(error => {
								console.log(error);
							});
					}

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
						msg.member
							.removeRole(oldRole)
							.then(() => {
								text += "Removed previous role for guild " + guildRole + " " + process.env.pepeCry + "\n";
							})
							.catch(error => {
								console.log(error);
								let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
								msg.channel.send(message);
							});
					}
				});

				let role = msg.guild.roles.find(role => role.name === guild);
				if (!role) {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Role for guild " + guild + " not found", ":interrobang:");
					msg.channel.send(message);
				} else {
					//if in alliance disc (Ally role exists) set it
					let allyRole = msg.guild.roles.find(role => role.name === "Ally");
					if (allyRole) {
						console.log("Setting Ally role");
						msg.member
							.addRole(allyRole)
							.then(() => {
								console.log("Ally role set");
							})
							.catch(error => {
								console.log(error);
							});
					}

					msg.member
						.addRole(role)
						.then(() => {
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Done!", text + "Role set for guild " + guild + " " + process.env.peepoHappy);
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
							let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
							msg.channel.send(message);
						});
				}
			} else {
				let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Invalid guild!", "Please send one of the following: " + validGuilds.toString());
				msg.channel.send(message);
			}
		})
		.catch(error => {
			console.log(error);
			let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
			msg.channel.send(message);
		});
};
module.exports = handleActionSetGuild;
