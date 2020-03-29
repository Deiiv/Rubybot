require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const handleOnReady = require("./subfunctions/handleOnReady.js");
const handleOnGuildMemberAdd = require("./subfunctions/handleOnGuildMemberAdd.js");
const handleOnMessage = require("./subfunctions/handleOnMessage.js");

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
client.on("guildMemberAdd", member => {
	handleOnGuildMemberAdd(Discord, member);
});

//message event
client.on("message", msg => {
	handleOnMessage(Discord, msg);
});

//login the bot client
client.login(process.env.clientkey);
