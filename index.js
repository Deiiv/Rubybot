/*

Entry point for the Discord bot

Details:
- Discord bot login is handled here
- All incoming Discord events are handled here initially (messages, server joins, reactions, etc.)

*/

require("dotenv").config();
const logger = require("./subfunctions/logger");
const { Discord, Client, Intents } = require('discord.js');
const client = new Client({ intents: new Intents(32767), partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const handleOnReady = require("./subfunctions/handleOnReady.js");
const handleOnGuildMemberAdd = require("./subfunctions/handleOnGuildMemberAdd.js");
const handleOnMessage = require("./subfunctions/handleOnMessage.js");
const handleMessageReaction = require("./subfunctions/handleMessageReaction.js");
const handleOnInteraction = require("./subfunctions/handleOnInteraction");

/*

-------------------- TODO --------------------

total lvl for profs
	score board (top 10/20)]

maybe add a counter for other statistics, who uses the most commands? total command counter?

integrate with slash commands

*/

//client initiated and is ready
client.on("ready", () => {
	try {
		handleOnReady(client);
	} catch (err) {
		logger.info(err);
	}
});

//someone new joined the server
client.on("guildMemberAdd", (member) => {
	try {
		handleOnGuildMemberAdd(member);
	} catch (err) {
		logger.info(err);
	}
});

//message event
client.on("messageCreate", (msg) => {
	try {
		handleOnMessage(msg);
	} catch (err) {
		logger.info(err);
	}
});

//interaction created event (slash commands)
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	try {
		await handleOnInteraction(interaction);
	} catch (err) {
		logger.info(err);
	}
});

client.on("messageReactionAdd", (reaction, user) => {
	try {
		handleMessageReaction(reaction, user, "add");
	} catch (err) {
		logger.info(err);
	}
});

client.on("messageReactionRemove", (reaction, user) => {
	try {
		handleMessageReaction(reaction, user, "remove");
	} catch (err) {
		logger.info(err);
	}
});

//login the bot client
client.login(process.env.clientkey);

// log any shard errors (connection should automatically retry as of discord.js v12+)

client.on("shardError", (error) => {
	logger.info("A websocket connection encountered an error (shardError)");
	logger.info(error);
});

client.on("shardReconnecting", (id) => {
	logger.info(`Shard with ID ${id} reconnected.`);
});

client.on("shardDisconnect", (event, shardID) => {
	logger.info(`Shard with ID ${shardID} disconnected.`);
});