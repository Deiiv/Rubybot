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
				console.log("portal ", i, portalInfo);
			});

			// .find("div > div > div > h3")
			// .toArray()
			// .map((element) => $(element).text());

			// return resolve();
		})
		.catch((err) => {
			console.log("Error in getSiteData");
			console.log(err);
		});

	let message = new Discord.RichEmbed().setColor(process.env.embedColour).addField("something something portals");
	msg.channel.send(message);
};
module.exports = handleActionPortals;
