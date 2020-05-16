const logger = require("./logger");

var handleOnReady = function (client) {
	logger.info("Logged in as:");
	logger.info(client.user.username + " " + client.user.id);
	logger.info("Connected to the following servers:");
	client.guilds.forEach(function (guild) {
		logger.info(guild.name + " " + guild.id);
		// if(guild.name === "x") guild.leave();
	});
	logger.info("------------------------------");
	process.env.hypers = client.emojis.find((emoji) => emoji.name === "hypers") || "";
	process.env.pepeRuby = client.emojis.find((emoji) => emoji.name === "pepeRuby") || "";
	process.env.monkaThink = client.emojis.find((emoji) => emoji.name === "monkaThink") || "";
	process.env.pepeCry = client.emojis.find((emoji) => emoji.name === "pepeCry") || "";
	process.env.peepoHappy = client.emojis.find((emoji) => emoji.name === "peepoHappy") || "";
	process.env.pepoG = client.emojis.find((emoji) => emoji.name === "pepoG") || "";
	process.env.pogpeach = client.emojis.find((emoji) => emoji.name === "pogpeach") || "";
};
module.exports = handleOnReady;
