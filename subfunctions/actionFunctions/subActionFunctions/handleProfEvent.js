/*

Handles the a profession modification event

Details:
- Calls an API hosted on AWS through sendToApi
- Handles both read and write events (the API in the backend handles each differently based on the data provided)

*/

const sendToApi = require("./sendToApi.js");

var handleProfEvent = function (data) {
	return new Promise((resolve, reject) => {
		let message = {
			username: data.username,
			id: data.userid,
			action: data.action,
			prof: data.prof,
			level: data.level || "0",
			guild: data.guild,
			limit: data.limit || 25,
		};

		sendToApi(message, "/prof", function (response, error) {
			if (error) {
				return reject(error);
			} else {
				return resolve(response);
			}
		});
	});
};
module.exports = handleProfEvent;
