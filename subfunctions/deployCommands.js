const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const logger = require("./logger");

const commands = [
	new SlashCommandBuilder().setName('info').setDescription('For viewing bot information'),
	new SlashCommandBuilder().setName('help').setDescription('Help with available Rubybot commands'),
	new SlashCommandBuilder().setName('uptime').setDescription('Uptime of the bot and the underlying server'),
	new SlashCommandBuilder().setName('roll').setDescription('Roll dice'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.clientkey);

var deployCommands = function (clientId, guildId, guildName) {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => logger.info(`Successfully registered application commands for server ${guildName}`))
		.catch(err => {
			logger.info(err);
		});
}
module.exports = deployCommands;
