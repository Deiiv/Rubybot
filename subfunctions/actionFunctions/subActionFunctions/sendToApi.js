const fetch = require("node-fetch");
const logger = require("./../../logger");

var sendToApi = function (message, path, callback) {
	let url = process.env.rubybotApi + path;
	let msg = {
		method: "post",
		body: JSON.stringify(message),
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.rubybotApiKey,
		},
	};
	logger.info("Calling url : " + url + " | with message : " + JSON.stringify(message));

	function checkStatus(res) {
		if (res.ok) {
			// res.status >= 200 && res.status < 300
			return res;
		} else {
			throw new Error(res.status);
		}
	}

	fetch(url, msg)
		.then(checkStatus)
		.then((res) => res.text())
		.then((data) => {
			logger.info("Response : " + data);
			let json = JSON.parse(data);
			return callback(json.body);
		})
		.catch((err) => {
			logger.info("Error in fetch");
			logger.error(err);
			return callback(null, err);
		});
};
module.exports = sendToApi;
