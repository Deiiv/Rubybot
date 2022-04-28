const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [
	new SlashCommandBuilder().setName('info').setDescription('For viewing bot information'),
	new SlashCommandBuilder().setName('help').setDescription('Help with available Rubybot commands'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.clientkey);

var deployCommands = function (clientId, guildId, guildName) {
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log(`Successfully registered application commands for server ${guildName}`))
		.catch(console.error);
}
module.exports = deployCommands;
