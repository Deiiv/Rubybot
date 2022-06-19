/*

Function used to scan server members and ban anyone that copies the name of any user in a specific list

Details:
- This is to protect from scammers that pretend to be a certain user. Scammers will direct message other
server members, and because they are in the server it will show up as a "mutual server", which causes certain users
to trust them and get scammed
- Example scenario: someone changes their name to "Deiv" and messages random people in the server asking them
to log in and "vote" for our guild, but the link they provide is to their own website which steals your
credentials, afterwhich the scammer logs into your Dofus account and steals your items
- This function has a list of members to ignore, which is essentially the list of names to filter by but of the
original users (going off of the user id)
- Guild members list maxes out at 1000 (based on the documentation), so this function needs to be revisited later

*/

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
