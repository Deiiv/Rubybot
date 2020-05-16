const sendToApi = require("./sendToApi.js");

var getValidGuilds = function () {
	return new Promise((resolve, reject) => {
		let message = {
			action: "get",
			type: "guilds",
		};
		sendToApi(message, "/admin/guildlist", function (response, error) {
			if (error) {
				return reject(error);
			} else {
				let guildList = response.split(",");
				return resolve(guildList);
			}
		});
	});
};
module.exports = getValidGuilds;
