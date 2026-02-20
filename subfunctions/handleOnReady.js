const logger = require("./logger");
const deployCommands = require("./deployCommands");

var handleOnReady = function (client) {
	logger.info("Logged in as:");
	logger.info(client.user.username + " " + client.user.id);
	logger.info("Connected to the following servers:");
	client.guilds.cache.forEach(function (guild) {
		logger.info(guild.name + " " + guild.id);
		// if(guild.name === "x") guild.leave();

		// deploy commands in each server
		deployCommands(client.user.id, guild.id, guild.name);

		// adding emojis if not found in other servers
		if (!process.env.hypers) process.env.hypers = guild.emojis.cache.find((emoji) => emoji.name === "hypers") || "";
		if (!process.env.pepeRuby) process.env.pepeRuby = guild.emojis.cache.find((emoji) => emoji.name === "pepeRuby") || "";
		if (!process.env.monkaThink) process.env.monkaThink = guild.emojis.cache.find((emoji) => emoji.name === "monkaThink") || "";
		if (!process.env.pepeCry) process.env.pepeCry = guild.emojis.cache.find((emoji) => emoji.name === "pepeCry") || "";
		if (!process.env.peepoHappy) process.env.peepoHappy = guild.emojis.cache.find((emoji) => emoji.name === "peepoHappy") || "";
		if (!process.env.pepoG) process.env.pepoG = guild.emojis.cache.find((emoji) => emoji.name === "pepoG") || "";
		if (!process.env.pogpeach) process.env.pogpeach = guild.emojis.cache.find((emoji) => emoji.name === "pogpeach") || "";
		if (!process.env.ruby) process.env.ruby = guild.emojis.cache.find((emoji) => emoji.name === "ruby") || "";
		if (!process.env.monkaO) process.env.monkaO = guild.emojis.cache.find((emoji) => emoji.name === "monkaO") || "";
		if (!process.env.phoebepog) process.env.phoebepog = guild.emojis.cache.find((emoji) => emoji.name === "PhoebePog") || "";
		if (!process.env.phoepeek) process.env.phoepeek = guild.emojis.cache.find((emoji) => emoji.name === "PhoePeek") || "";
		if (!process.env.celface) process.env.celface = guild.emojis.cache.find((emoji) => emoji.name === "cel_face") || "";
	});
	logger.info("------------------------------");
	// these are defined here so that .env can be hidden, but still have customizable values stored in git
	process.env.adminUserTag = "<@140904638084808705>";
	process.env.embedColour = "#FEC6C7";
	process.env.botversion = 12.06;
	process.env.runtime = "Node.Js 18.x | Discord.Js 13.x";
	process.env.host = "Deiv's House";
	process.env.author = "Deiv";
	process.env.rollMinX = 1;
	process.env.rollMaxX = 4;
	process.env.rollMinY = 1;
	process.env.rollMaxY = 100;
};
module.exports = handleOnReady;
