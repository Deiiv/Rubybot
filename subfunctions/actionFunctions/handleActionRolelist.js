const Discord = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");
const getValidRoles = require("./subActionFunctions/getValidRoles.js");

var handleActionRolelist = function(msg) {
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
						sendToApi(message, "/admin/rolelist", function(response, error) {
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
						sendToApi(message, "/admin/rolelist", function(response, error) {
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
};
module.exports = handleActionRolelist;
