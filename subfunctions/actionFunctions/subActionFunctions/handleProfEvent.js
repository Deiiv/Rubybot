const sendToApi = require("./sendToApi.js");

var handleProfEvent = function(data) {
	return new Promise((resolve, reject) => {
		let message = {
			username: data.username,
			id: data.userid,
			action: data.action,
			prof: data.prof,
			level: data.level || "0",
			guild: data.guild,
			limit: data.limit || 25
		};

		sendToApi(message, "/prof", function(response, error) {
			if (error) {
				return reject(error);
			} else {
				return resolve(response);
			}
		});
	});
};
module.exports = handleProfEvent;
