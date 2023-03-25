const Discord = require("discord.js");
const logger = require("./../logger");

var handleActionUptime = function (msg) {
	const uptimeEmbed = new Discord.MessageEmbed()
		.setColor(process.env.embedColour)
		.addFields(
			{ name: 'Rubybot uptime:', value: secondsFormat(process.uptime()) },
			{ name: 'Server uptime:', value: secondsFormat(require('os').uptime()) },
		);

	msg.reply({ embeds: [uptimeEmbed] });
};
module.exports = handleActionUptime;

function secondsFormat(d) {
	d = Number(d);

	var dy = Math.floor(d / 86400);
	var h = Math.floor(d % 86400 / 3600);
	var m = Math.floor(d % 86400 % 3600 / 60);
	var s = Math.floor(d % 86400 % 3600 % 60);

	var dyDisplay = dy > 0 ? dy + (dy == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dyDisplay + hDisplay + mDisplay + sDisplay;
}