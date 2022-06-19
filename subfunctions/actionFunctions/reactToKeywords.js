/*

Function used to react to specific key words in a message

Details:
- If a message contains keyWords.key it would react with keyWords.reaction
- Handles all keyWords in the list
- Order is not gauranteed because forEach is async

*/

const logger = require("../logger");

const keyWords = [
	{
		key: "phoebe",
		reaction: process.env.phoebepog
	},
	{
		key: "somerandomtestkeyword",
		reaction: process.env.hypers
	}
];

var reactToKeywords = function (msg) {
	try {
		keyWords.forEach(keyWord => {
			if (msg.content.toLowerCase().indexOf(keyWord.key) != -1) {
				// only add reaction if the emoji exists in bot memory
				if (keyWord.reaction) msg.react(keyWord.reaction);
			}
		})
	}
	catch (err) {
		logger.info("Hit an error at reactToKeywords");
		logger.info(err);
	}
};
module.exports = reactToKeywords;
