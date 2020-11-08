const Discord = require("discord.js");
const getSiteData = require("./subActionFunctions/getSiteData.js");
const logger = require("../logger");
const cheerio = require("cheerio");

var handleActionPortals = function (msg) {
	console.log("portals action");
	getSiteData("dofus-portals.fr", "/portails/66")
		.then((siteData) => {
			console.log("Got siteData : " + JSON.stringify(siteData));
			let $ = cheerio.load(siteData, {
				decodeEntities: false,
			});

			const portalList = $(".portal").toArray();

			var count = 0;
			portalList.forEach((portal, i) => {
				let $ = cheerio.load(portal, {
					decodeEntities: false,
				});
				var portalInfo = $(".portal")
					.find("div > div > div > h3")
					.toArray()
					.map((element) => $(element).text());

				let text = `portal #${i} pos |${portalInfo[0]}| utilization |${portalInfo[1]}| last updated |${portalInfo[3]}|`;
				console.log(text);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(text);
				msg.channel.send(message);
			});

			/*
			portal #0 pos |[-33,-63]| utilization |Utilisations 76 | last updated | 1 h 52 min|
			portal #1 pos |[-18,39]| utilization |Utilisations 80 | last updated |2 min|
			portal #2 pos |[-51,5]| utilization |Utilisations 126 | last updated |46 min|
			portal #3 pos |Actions entravées| utilization |undefined| last updated |undefined|

			^^^^^ if undefined, then it's unknown


			*/

			// .find("div > div > div > h3")
			// .toArray()
			// .map((element) => $(element).text());

			// return resolve();
		})
		.catch((err) => {
			console.log("Error in getSiteData");
			console.log(err);
		});
};
module.exports = handleActionPortals;
