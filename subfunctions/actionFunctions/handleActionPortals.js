/*

Handles the "portals" action, which provides the user with the location of a specific portal (or all portals)

Details:
- The portals listed are for the Ilyzaelle Dofus server
- Data is pulled from a 3rd party website not managed by us, dofus-portals.fr
- Uses getSiteData to pull the site data (and gets it back as a string)
- Uses cheerio to parse the site data

*/

const Discord = require("discord.js");
const getSiteData = require("./subActionFunctions/getSiteData.js");
const logger = require("../logger");
const cheerio = require("cheerio");

var handleActionPortals = function (msg, notAnInteraction) {
	if (notAnInteraction) {
		let messageContent = msg.content.split(" ");
		var specificPortal;
		if (messageContent[1]) {
			if (messageContent[1].toLowerCase().startsWith("enu")) specificPortal = "Enurado";
			else if (messageContent[1].toLowerCase().startsWith("sram")) specificPortal = "Srambad";
			else if (messageContent[1].toLowerCase().startsWith("xel")) specificPortal = "Xelorium";
			else if (messageContent[1].toLowerCase().startsWith("eca")) specificPortal = "Ecaflipus";
		} else if (messageContent[0] === "!portal") return;
		var server = {
			code: 66, // ilyzaelle
			name: "Ilyzaelle",
		};
		// jahash, for !portals j OR !portal enu j
		if ((messageContent[1] && messageContent[1].toLowerCase().startsWith("j")) || (messageContent[2] && messageContent[2].toLowerCase().startsWith("j"))) server = { code: 84, name: "Jahash" };
		getSiteData("dofus-portals.fr", `/portails/${server.code}`)
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

					if (portalInfo[1]) text = `Is at ${portalInfo[0]}\nHas ${portalInfo[1].split(" ")[1]} uses left\nWas last updated ${portalInfo[3]} ago`;
					else text = `Unknown! ${process.env.pepeCry}`;
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`${dimensionName} Portal Info - ${server.name}`).setDescription(text).setThumbnail(thumbnail);
					msg.channel.send({ embeds: [message] });
				});
			})
			.catch((err) => {
				logger.info("Error in getSiteData");
				logger.info(err);
			});
	}
	else {
		var portalChoice = msg.options.getString('dimension');

		var server = {
			code: 66, // ilyzaelle
			name: "Ilyzaelle",
		};

		/*
		NOT SUPPORTED ATM
			
		// jahash, for !portals j OR !portal enu j
		// if ((messageContent[1] && messageContent[1].toLowerCase().startsWith("j")) || (messageContent[2] && messageContent[2].toLowerCase().startsWith("j"))) server = { code: 84, name: "Jahash" };
			
		*/

		getSiteData("dofus-portals.fr", `/portails/${server.code}`)
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
					if (portalChoice != "All Dimensions" && portalChoice != dimensionName) return;

					let portalInfo = $(".portal")
						.find("div > div > div > h3")
						.toArray()
						.map((element) => $(element).text());

					if (portalInfo[1]) text = `Is at ${portalInfo[0]}\nHas ${portalInfo[1].split(" ")[1]} uses left\nWas last updated ${portalInfo[3]} ago`;
					else text = `Unknown! ${process.env.pepeCry}`;
					let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle(`${dimensionName} Portal Info - ${server.name}`).setDescription(text).setThumbnail(thumbnail);
					msg.reply({ embeds: [message] });
				});
			})
			.catch((err) => {
				logger.info("Error in getSiteData");
				logger.info(err);
				let message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Encountered an error, please try again later").setDescription(":interrobang:");
				msg.reply({ embeds: [message], ephemeral: true });
			});
	}
};
module.exports = handleActionPortals;
