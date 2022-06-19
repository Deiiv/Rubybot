/*

Handles the "onReady" event, which is sent to the bot once the login is successful

Details:
- All initialization actions should occur here (to make sure the bot is in a logged in state)
- This is also where we can manually leave a server if needed, using `if(guild.name === "x") guild.leave();`

*/

const logger = require("./logger");
const deployCommands = require("./deployCommands");
const scanMembers = require("./scanMembers.js");
const cron = require('node-cron');

var handleOnReady = function (client) {
	logger.info("Logged in as:");
	logger.info(client.user.username + " " + client.user.id);
	logger.info("Connected to the following servers:");
	client.guilds.cache.forEach(function (guild) {
		logger.info(guild.name + " " + guild.id);

		/*
			Setting up a cron job to run every minute

			The function called searches through members in guild and removes those that have the same name as certain people

			It should also send a notification of the removal in an admin channel

			Currently only runs for a specific server
		*/
		if (guild.id === process.env.rubyServerID) {

			// cron.schedule('* * * * *', () => {
			// 	console.log('running a task every minute');
			scanMembers(guild);
			// });
		}

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
	});
	logger.info("------------------------------");
	// these are defined here so that .env can be hidden, but still have customizable values stored in git
	process.env.adminUserTag = "<@140904638084808705>";
	process.env.embedColour = "#FEC6C7";
	process.env.botversion = 10.05;
	process.env.runtime = "Node.Js 16.x | Discord.Js 13.x";
	process.env.host = "AWS";
	process.env.author = "Deiv";
	process.env.rollMinX = 1;
	process.env.rollMaxX = 4;
	process.env.rollMinY = 1;
	process.env.rollMaxY = 100;
};
module.exports = handleOnReady;
