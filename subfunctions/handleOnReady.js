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
	});
	logger.info("------------------------------");
	process.env.hypers = client.emojis.cache.find((emoji) => emoji.name === "hypers") || "";
	process.env.pepeRuby = client.emojis.cache.find((emoji) => emoji.name === "pepeRuby") || "";
	process.env.monkaThink = client.emojis.cache.find((emoji) => emoji.name === "monkaThink") || "";
	process.env.pepeCry = client.emojis.cache.find((emoji) => emoji.name === "pepeCry") || "";
	process.env.peepoHappy = client.emojis.cache.find((emoji) => emoji.name === "peepoHappy") || "";
	process.env.pepoG = client.emojis.cache.find((emoji) => emoji.name === "pepoG") || "";
	process.env.pogpeach = client.emojis.cache.find((emoji) => emoji.name === "pogpeach") || "";
	process.env.ruby = client.emojis.cache.find((emoji) => emoji.name === "ruby") || "";
	process.env.monkaO = client.emojis.cache.find((emoji) => emoji.name === "monkaO") || "";
	// these are defined here so that .env can be hidden, but still have customizable values stored in git
	process.env.adminUserTag = "<@140904638084808705>";
	process.env.embedColour = "#FEC6C7";
	process.env.botversion = 10.02;
	process.env.runtime = "Node.Js 16.x | Discord.Js 13.x";
	process.env.host = "AWS";
	process.env.author = "Deiv";
	process.env.rollMinX = 1;
	process.env.rollMaxX = 4;
	process.env.rollMinY = 1;
	process.env.rollMaxY = 100;
};
module.exports = handleOnReady;
