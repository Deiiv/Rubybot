require("dotenv").config();
const logger = require("./subfunctions/logger");
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const handleOnReady = require("./subfunctions/handleOnReady.js");
const handleOnGuildMemberAdd = require("./subfunctions/handleOnGuildMemberAdd.js");
const handleOnMessage = require("./subfunctions/handleOnMessage.js");
const handleMessageReaction = require("./subfunctions/handleMessageReaction.js");

/*

-------------------- TODO --------------------

add nickname instead of username (maybe setnickname command)

!portals

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
client.on("message", (msg) => {
	try {
		handleOnMessage(msg);
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
	logger.info(err);
});

client.on("shardReconnecting", (id) => {
	logger.info(`Shard with ID ${id} reconnected.`);
});

client.on("shardDisconnect", (event, shardID) => {
	logger.info(`Shard with ID ${shardID} disconnected.`);
});
