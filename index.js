require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();

const profList = ["Alchemist", "Farmer", "Fisherman", "Hunter", "Lumberjack", "Miner", "Artificer", "Carver", "Handyman", "Jeweller", "Shoemaker", "Smith", "Tailor", "Craftmagus", "Carvmagus", "Costumagus", "Jewelmagus", "Shoemagus", "Smithmagus"];

/*

-------------------- TODO --------------------

add nickname instead of username (maybe setnickname command)

!portals

*/

const handleOnReady = require("./subfunctions/handleOnReady.js");
const handleOnGuildMemberAdd = require("./subfunctions/handleOnGuildMemberAdd.js");
const handleOnMessage = require("./subfunctions/handleOnMessage.js");

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
