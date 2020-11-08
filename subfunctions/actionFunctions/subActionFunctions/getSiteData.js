const http = require("http");

var getSiteData = function (host, path) {
	return new Promise((resolve, reject) => {
		let options = {
			host,
			port: 80,
			path,
		};
		http
			.get(options, function (res) {
				let siteBody = "";
				res.on("data", function (data) {
					siteBody += data;
				});
				res.on("end", function () {
					return resolve(siteBody);
				});
			})
			.on("error", function (err) {
				return reject(err);
			});
	});
};
module.exports = getSiteData;
