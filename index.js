require("dotenv").config();
const logger = require("./subfunctions/logger");
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const handleOnReady = require("./subfunctions/handleOnReady.js");
const handleOnGuildMemberAdd = require("./subfunctions/handleOnGuildMemberAdd.js");
const handleOnMessage = require("./subfunctions/handleOnMessage.js");
const handleRaw = require("./subfunctions/handleRaw.js");
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

// required for emitting reactions on an old message for messageReactionAdd and messageReactionRemove
// client.on("raw", (packet) => {
// 	try {
// 		handleRaw(client, packet);
// 	} catch (err) {
// 		logger.info(err);
// 	}
// });

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

// healthcheck

// require("http")
// 	.createServer(function (req, res) {
// 		res.writeHead(200);
// 		res.end();
// 	})
// 	.listen(7);
// process.setgid('nobody');
// process.setuid('nobody');

// log any shard errors

// client.on("shardError", (error) => {
// 	logger.info("A websocket connection encountered an error (shardError)");
// 	logger.info(err);
// });
