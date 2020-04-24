var handleOnReady = function (client) {
	console.log("Logged in as:");
	console.log(client.user.username + " " + client.user.id);
	console.log("\nConnected to the following servers:");
	client.guilds.forEach(function (guild) {
		console.log(guild.name + " " + guild.id);
		// if(guild.name === "x") guild.leave();
	});
	console.log("------------------------------\n");

	process.env.hypers = client.emojis.find((emoji) => emoji.name === "hypers") || "";
	process.env.pepeRuby = client.emojis.find((emoji) => emoji.name === "pepeRuby") || "";
	process.env.monkaThink = client.emojis.find((emoji) => emoji.name === "monkaThink") || "";
	process.env.pepeCry = client.emojis.find((emoji) => emoji.name === "pepeCry") || "";
	process.env.peepoHappy = client.emojis.find((emoji) => emoji.name === "peepoHappy") || "";
	process.env.pepoG = client.emojis.find((emoji) => emoji.name === "pepoG") || "";
	process.env.pogpeach = client.emojis.find((emoji) => emoji.name === "pogpeach") || "";
};
module.exports = handleOnReady;
