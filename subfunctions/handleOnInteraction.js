const Discord = require("discord.js");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionUptime = require("./actionFunctions/handleActionUptime.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAdd = require("./actionFunctions/handleActionAdd.js");
const handleActionContact = require("./actionFunctions/handleActionContact.js");
const handleActionPortals = require("./actionFunctions/handleActionPortals.js");
const handleActionBackup = require("./actionFunctions/handleActionBackup.js");
const validCommands = ["!info", "!help", "!roll", "!alma", "!view", "!setguild", "!add", "!contact", "!portals", "!portal", "!backup"];

var handleOnInteraction = async function (interaction) {
	if (interaction.channel.name === "talk-to-rubybot" || interaction.channel.name === "professions" || interaction.channel.name === "development" || interaction.channel.name === "test") {
		const { commandName } = interaction;
		if (commandName === 'info') {
			handleActionInfo(interaction, true);
		} else if (commandName === 'help') {
			handleActionHelp(interaction, true);
		} else if (commandName === 'uptime') {
			handleActionUptime(interaction);
		}
		// else if (commandName === 'roll') {
		// 	handleActionRoll(interaction, true);
		// } else if (commandName === 'alma') {
		// 	handleActionAlma(interaction, true);
		// } else if (commandName === 'view') {
		// 	handleActionView(interaction, true);
		// } else if (commandName === 'setGuild') {
		// 	handleActionSetGuild(interaction, true);
		// } else if (commandName === 'add') {
		// 	handleActionAdd(interaction, true);
		// } else if (commandName === 'portals') {
		// 	handleActionPortals(interaction, true);
		// }
	}
	else {
		let talkToRubybotChannel = interaction.guild.channels.cache.find((ch) => ch.name === "talk-to-rubybot");
		var text = "Please create a channel named 'talk-to-rubybot' to send your commands.";
		if (talkToRubybotChannel) text = `Please send your commands in ${talkToRubybotChannel.toString()}`;
		var message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`Wrong channel! ${process.env.monkaO}`).setDescription(text);
		await interaction.reply({ embeds: [message] });
	}
};
module.exports = handleOnInteraction;
