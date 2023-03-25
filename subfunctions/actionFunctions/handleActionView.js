const Discord = require("discord.js");
const logger = require("./../logger");
const handleProfEvent = require("./subActionFunctions/handleProfEvent.js");
const profList = [
	"Alchemist",
	"Farmer",
	"Fisherman",
	"Hunter",
	"Lumberjack",
	"Miner",
	"Artificer",
	"Carver",
	"Handyman",
	"Jeweller",
	"Shoemaker",
	"Smith",
	"Tailor",
	"Craftmagus",
	"Carvmagus",
	"Costumagus",
	"Jewelmagus",
	"Shoemagus",
	"Smithmagus",
];

var handleActionView = function (msg) {
	let messageContent = msg.content.split(" ");
	if (messageContent.length === 1) {
		let userid = msg.author.id;
		let params = {
			userid: userid,
			action: "view",
		};
		handleProfEvent(params)
			.then((response) => {
				let data = JSON.parse(response);
				if (!data.guild) {
					data.guild = "None (use !setguild to set this value)";
				}
				if (!data.profList || data.profList.length < 1) {
					data.profList = "None (add a prof with !add, see !help prof for details)";
				}

				let message = new Discord.MessageEmbed()
					.setColor(process.env.embedColour)
					.setTitle(`:tools: ${data.username}'s Professions :hammer_pick:`)
					.setDescription(data.profList)
					.addFields(
						{ name: ':shield: Guild :shield:', value: data.guild },
					);
				msg.channel.send({ embeds: [message] });
			})
			.catch((error) => {
				logger.error(error);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
				msg.channel.send({ embeds: [message] });
			});
	}
	//view user by IGN !view user IGN
	else if (messageContent[1].toUpperCase() === "USER") {
		if (messageContent[2]) {
			let username = messageContent[2];
			let params = {
				username: username,
				action: "view",
			};
			handleProfEvent(params)
				.then((response) => {
					if (response === "NONE") {
						let message = new Discord.MessageEmbed()
							.setColor(process.env.embedColour)
							.setTitle("User " + username + " doesn't exist in our records!")
							.setDescription(process.env.pepoG);
						msg.channel.send({ embeds: [message] });
					} else {
						let data = JSON.parse(response);
						if (!data.guild) {
							data.guild = "None (use !setguild to set this value)";
						}
						if (!data.profList || data.profList.length < 1) {
							data.profList = "None (add a prof with !add, see !help prof for details)";
						}

						let message = new Discord.MessageEmbed()
							.setColor(process.env.embedColour)
							.setTitle(`:tools: ${username}'s Professions :hammer_pick:`)
							.setDescription(data.profList)
							.addFields(
								{ name: ':shield: Guild :shield:', value: data.guild },
							);
						msg.channel.send({ embeds: [message] });
					}
				})
				.catch((error) => {
					logger.error(error);
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
					msg.channel.send({ embeds: [message] });
				});
		} else {
			let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("View proper usage by calling !help prof");
			msg.channel.send({ embeds: [message] });
		}
	}
	//view profs !view prof OR !view prof level
	else {
		if (messageContent[1]) {
			messageContent[1] = messageContent[1].toLowerCase();
			let prof = messageContent[1].charAt(0).toUpperCase() + messageContent[1].slice(1);
			if (profList.includes(prof)) {
				if (messageContent[2] && (messageContent[2] < 1 || messageContent[2] > 200)) {
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("View proper usage by calling !help prof");
					msg.channel.send({ embeds: [message] });
					return;
				}

				let level = Math.floor(messageContent[2]);

				let params = {
					action: "getProf",
					prof: prof,
					level: level,
					limit: 20,
				};
				handleProfEvent(params)
					.then((response) => {
						var levelMessage = "";
						if (messageContent[2]) {
							levelMessage = " >= " + level;
						}
						if (response === "NONE") {
							let message = new Discord.MessageEmbed()
								.setColor(process.env.embedColour)
								.setTitle(process.env.pepoG + " Users with " + prof + levelMessage)
								.setDescription("None!");
							msg.channel.send({ embeds: [message] });
						} else {
							let data = JSON.parse(response);
							if (data.string === "") {
								data.string = "None!";
							}
							let message = new Discord.MessageEmbed()
								.setColor(process.env.embedColour)
								.setTitle(process.env.pepoG + " List of users with " + prof + " profession" + levelMessage)
								.setDescription(data.string);
							msg.channel.send({ embeds: [message] });
						}
					})
					.catch((error) => {
						logger.error(error);
						let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Encountered an error: ${error.message}`).setDescription(":interrobang:");
						msg.channel.send({ embeds: [message] });
					});
			} else {
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid profession! List of valid professions:").setDescription(profList.toString());
				msg.channel.send({ embeds: [message] });
			}
		} else {
			let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("View proper usage by calling !help prof");
			msg.channel.send({ embeds: [message] });
		}
	}
};
module.exports = handleActionView;
