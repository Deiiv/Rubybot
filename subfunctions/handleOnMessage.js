const Discord = require("discord.js");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAdd = require("./actionFunctions/handleActionAdd.js");
const handleActionContact = require("./actionFunctions/handleActionContact.js");
const handleActionPortals = require("./actionFunctions/handleActionPortals.js");

var handleOnMessage = function (msg) {
	// ignore bot messages
	if (msg.author.bot) return;

	switch (msg.content.split(" ")[0]) {
		// view bot info
		case "!info":
			handleActionInfo(msg);
			break;
		// view help menu
		case "!help":
			handleActionHelp(msg);
			break;
		// rolls dice
		case "!roll":
			handleActionRoll(msg);
			break;
		// alma monthly call
		case "!alma":
			handleActionAlma(msg);
			break;
		// view profession details
		case "!view":
			handleActionView(msg);
			break;
		// set guild in db for user
		case "!setguild":
			handleActionSetGuild(msg);
			break;
		// add prof actions
		case "!add":
			handleActionAdd(msg);
			break;
		// contacts discord admins in guild discord
		case "!contact":
			handleActionContact(msg);
			break;
		// gets current dimension portals
		case "!portals":
			handleActionPortals(msg);
			break;
		default:
			break;
	}
};
module.exports = handleOnMessage;
