const Discord = require("discord.js");
const logger = require("./../logger");

var handleActionUptime = function (msg) {
	const uptimeEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addField("Rubybot uptime:", secondsFormat(process.uptime()))
		.addField("Server uptime:", secondsFormat(require('os').uptime()));

	msg.reply({ embeds: [uptimeEmbed] });
};
module.exports = handleActionUptime;

function secondsFormat(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);

	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return hDisplay + mDisplay + sDisplay;
}