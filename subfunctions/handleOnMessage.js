const Discord = require("discord.js");
const handleActionInfo = require("./actionFunctions/handleActionInfo.js");
const handleActionHelp = require("./actionFunctions/handleActionHelp.js");
const handleActionAdmin = require("./actionFunctions/handleActionAdmin.js");
const handleActionRoll = require("./actionFunctions/handleActionRoll.js");
const handleActionSetGuild = require("./actionFunctions/handleActionSetGuild.js");
const handleActionAlma = require("./actionFunctions/handleActionAlma.js");
const handleActionGuildlist = require("./actionFunctions/handleActionGuildlist.js");
const handleActionView = require("./actionFunctions/handleActionView.js");
const handleActionSetRole = require("./actionFunctions/handleActionSetRole.js");
const handleActionRemoveRole = require("./actionFunctions/handleActionRemoveRole.js");
const handleActionRolelist = require("./actionFunctions/handleActionRolelist.js");
const handleActionAdd = require("./actionFunctions/handleActionAdd.js");
const handleActionContact = require("./actionFunctions/handleActionContact.js");
const handleActionSubmit = require("./actionFunctions/handleActionSubmit.js");

var handleOnMessage = function(msg) {
	if (msg.author.bot) return;

	if (msg.content.startsWith("!info")) handleActionInfo(msg);

	if (msg.content.startsWith("!help")) handleActionHelp(msg);

	if (msg.content.startsWith("!admin")) handleActionAdmin(msg);

	if (msg.content.startsWith("!roll")) handleActionRoll(msg);

	if (msg.content.startsWith("!setguild")) handleActionSetGuild(msg);

	//alma monthly call
	if (msg.content.startsWith("!alma")) handleActionAlma(msg);

	//managing guild list
	if (msg.content.startsWith("!guildlist")) handleActionGuildlist(msg);

	//view prof
	if (msg.content.startsWith("!view")) handleActionView(msg);

	//set role
	if (msg.content.startsWith("!setrole")) handleActionSetRole(msg);

	//set role
	if (msg.content.startsWith("!removerole")) handleActionRemoveRole(msg);

	//managing role list
	if (msg.content.startsWith("!rolelist")) handleActionRolelist(msg);

	// add prof actions
	if (msg.content.startsWith("!add")) handleActionAdd(msg);

	//contacts discord admins in guild discord
	if (msg.content.startsWith("!contact")) handleActionContact(msg);

	//contacts discord admins in alliance discord
	if (msg.content.startsWith("!submit")) handleActionSubmit(msg);
};
module.exports = handleOnMessage;
