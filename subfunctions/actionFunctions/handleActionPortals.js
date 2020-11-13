const Discord = require("discord.js");
const getSiteData = require("./subActionFunctions/getSiteData.js");
const logger = require("../logger");
const cheerio = require("cheerio");

var handleActionPortals = function (msg) {
	let messageContent = msg.content.split(" ");
	var specificPortal;
	if (messageContent[1]) {
		if (messageContent[1].toLowerCase().startsWith("enu")) specificPortal = "Enurado";
		else if (messageContent[1].toLowerCase().startsWith("sram")) specificPortal = "Srambad";
		else if (messageContent[1].toLowerCase().startsWith("xel")) specificPortal = "Xelorium";
		else if (messageContent[1].toLowerCase().startsWith("eca")) specificPortal = "Ecaflipus";
	}
	if (messageContent[0] === "portal" && !messageContent[1]) return;
	getSiteData("dofus-portals.fr", "/portails/66")
		.then((siteData) => {
			let $ = cheerio.load(siteData, {
				decodeEntities: false,
			});

			var portalList = $(".portal").toArray();

			portalList.forEach((portal, i) => {
				let $ = cheerio.load(portal, {
					decodeEntities: false,
				});
				let dimensionName = $(".portal")
					.find("div > div > div > h2")
					.toArray()
					.map((element) => $(element).text())[0];
				let thumbnail = `https://dofus-portals.fr/images/portals/${dimensionName}.png`;
				if (dimensionName === "Enutrosor") dimensionName = "Enurado";
				if (specificPortal && specificPortal != dimensionName) return;

				let portalInfo = $(".portal")
					.find("div > div > div > h3")
					.toArray()
					.map((element) => $(element).text());

				if (portalInfo[1]) text = `Pos: ${portalInfo[0]}\nUses: ${portalInfo[1].split(" ")[1]}\nLast updated ${portalInfo[3]} ago`;
				else text = `Unknown! ${process.env.pepeCry}`;
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`${dimensionName} Portal Info`).setDescription(text).setThumbnail(thumbnail);
				msg.channel.send(message);
			});
		})
		.catch((err) => {
			logger.info("Error in getSiteData");
			logger.info(err);
		});
};
module.exports = handleActionPortals;
