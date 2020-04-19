require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
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
	handleOnReady(client);
});

//someone new joined the server
client.on("guildMemberAdd", (member) => {
	handleOnGuildMemberAdd(member);
});

//message event
client.on("message", (msg) => {
	handleOnMessage(msg);
});

// required for emitting reactions on an old message for messageReactionAdd and messageReactionRemove
client.on("raw", (packet) => {
	handleRaw(client, packet);
});

client.on("messageReactionAdd", (reaction, user) => {
	handleMessageReaction(reaction, user, "add");
});

client.on("messageReactionRemove", (reaction, user) => {
	handleMessageReaction(reaction, user, "remove");
});

//login the bot client
client.login(process.env.clientkey);
