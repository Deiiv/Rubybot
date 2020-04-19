/*





ARCHIVED

Not in user





*/

const Discord = require("discord.js");
const sendToApi = require("./subActionFunctions/sendToApi.js");
const getValidGuilds = require("./subActionFunctions/getValidGuilds.js");

var handleActionGuildlist = function (msg) {
	//check that a valid user is calling the command
	if (msg.member.roles.find((r) => r.name === "BotAdmin")) {
		let messageContent = msg.content.split(" ");
		//get current list of valid guilds
		if (messageContent[1] === "view") {
			getValidGuilds()
				.then((validGuilds) => {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Current list of valid guilds:", validGuilds.toString());
					msg.channel.send(message);
				})
				.catch((error) => {
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
					msg.channel.send(message);
				});
		} else if (messageContent[1] === "add") {
			let guildToAdd = messageContent.splice(2).join(" ");
			console.log("New Guild : " + guildToAdd);

			getValidGuilds()
				.then((validGuilds) => {
					if (validGuilds.includes(guildToAdd)) {
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Guild " + guildToAdd + " is already in guild list", process.env.monkaThink);
						msg.channel.send(message);
					} else {
						console.log("Old guildList : " + validGuilds.toString());
						validGuilds.push(guildToAdd);
						console.log("New guildList : " + validGuilds.toString());

						let message = {
							action: "update",
							value: validGuilds.toString(),
							type: "guilds",
						};
						sendToApi(message, "/admin/guildlist", function (response, error) {
							if (error) {
								console.log(error);
								let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
								msg.channel.send(message);
							} else {
								let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Guild list updated, new list: ", validGuilds.toString());
								msg.channel.send(message);
							}
						});
					}
				})
				.catch((error) => {
					console.log(error);
					let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
					msg.channel.send(message);
				});
		} else if (messageContent[1] === "remove") {
			let guildToRemove = messageContent.splice(2).join(" ");
			console.log("Removing Guild : " + guildToRemove);

			getValidGuilds()
				.then((validGuilds) => {
					if (validGuilds.includes(guildToRemove)) {
						console.log("Old guildList : " + validGuilds.toString());
						validGuilds.splice(validGuilds.indexOf(guildToRemove), 1);
						console.log("New guildList : " + validGuilds.toString());

						let message = {
							action: "update",
							value: validGuilds.toString(),
							type: "guilds",
						};
						sendToApi(message, "/admin/guildlist", function (response, error) {
							if (error) {
								console.log(error);
								let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Encountered an error: " + error.message, ":interrobang:");
								msg.channel.send(message);
							} else {
								let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("Guild list updated, new list: ", validGuilds.toString());
								msg.channel.send(message);
							}
						});
					} else {
						console.log("Guild trying to remove is not in current list");
						let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("The guild " + guildToRemove + " is not in the current list, so can't remove it.", "" + process.env.pepoG);
						msg.channel.send(message);
					}
				})
				.catch((error) => {
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
module.exports = handleActionGuildlist;
