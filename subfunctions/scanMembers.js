const logger = require("./logger");

var scanMembers = function (guild) {
	console.log(`Running scanMembers function for ${guild.name} | ${guild.id}`);
	try {
		guild.members.cache.each(member => {
			console.log(member.user.tag);
			console.log(member.displayName);
		});


		// forEach(member => {
		// 	console.log(member.nickname);
		// })
	}
	catch (err) {
		console.log(err);
	}
};
module.exports = scanMembers;
