const logger = require("./logger");
// list of users to ignore in the scan/removal
const scanMembersIgnoreList = ["140904638084808705"];
// list of names to match, lower cased
const namesToFilter = ["deiv", "celerity"];

var scanMembers = function (guild) {
	console.log(`Running scanMembers function for ${guild.name} | ${guild.id}`);
	logger.info(`Running scanMembers function for ${guild.name} | ${guild.id}`);
	try {
		guild.members.cache.each(member => {
			console.log(`Checking for: ${memberTag} | ${memberId} | ${memberDisplayName}`);

			let memberTag = member.user.tag;
			let memberDisplayName = member.displayName;
			let memberId = member.user.id;
			if (namesToFilter.includes(memberTag.split("#")[0].toLowerCase) && !scanMembersIgnoreList.includes(memberId)) {
				console.log(`Found a matching name: ${memberTag} | ${memberId} | ${memberDisplayName}`);
				logger.info(`Found a matching name: ${memberTag} | ${memberId} | ${memberDisplayName}`);

				// ban member with reason specified

				// send a message to the user notifying of the ban
				// ^mention reason, and who to contact if is a mistake

				// send a message to admin chat
			}
		});
	}
	catch (err) {
		console.log("Hit an error at scanMembers", err);
		logger.info("Hit an error at scanMembers");
		logger.info(err);
	}
};
module.exports = scanMembers;
