const sendToApi = require("./sendToApi.js");

var getValidRoles = function (guild) {
	return new Promise((resolve, reject) => {
		let message = {
			action: "get",
			type: "roles",
			guild: guild,
		};
		sendToApi(message, "/admin/rolelist", function (response, error) {
			if (error) {
				return reject(error);
			} else {
				let guildList = response ? response.split(",") : [];
				return resolve(guildList);
			}
		});
	});
};
module.exports = getValidRoles;
