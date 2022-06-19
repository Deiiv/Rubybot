/*

Deploys a list of slash commands

Details:
- Commands must be defined here in order for them to be registered as a slash command

*/

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const logger = require("./logger");

const commands = [
	new SlashCommandBuilder().setName('info').setDescription('For viewing bot information'),
	new SlashCommandBuilder().setName('help').setDescription('Help with available Rubybot commands'),
	new SlashCommandBuilder().setName('uptime').setDescription('Uptime of the bot and the underlying server'),
	// new SlashCommandBuilder().setName('roll').setDescription('Roll dice'),
	new SlashCommandBuilder().setName('alma').setDescription('View Almanax offerings for a specific month')
		.addStringOption(option =>
			option
				.setRequired(true)
				.setName('month')
				.setDescription('The month to pull Almanax info for'))
	// .addStringOption(option =>
	// 	option
	// 		.setRequired(true)
	// 		.setName('day')
	// 		.setDescription('The day to pull Almanax info for'))
	// .addStringOption(option =>
	// 	option
	// 		.setRequired(true)
	// 		.setName('day421412')
	// 		.addChoices()
	// 		.setDescription('The day to pull Almanax info for'))
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.clientkey);

var deployCommands = function (clientId, guildId, guildName) {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => logger.info(`Successfully registered application commands for server ${guildName}`))
		.catch(err => {
			logger.info("Hit an error at deployCommands");
			logger.info(err);
		});
}
module.exports = deployCommands;
