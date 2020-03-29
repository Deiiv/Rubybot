const fetch = require("node-fetch");
const http = require("http");
const promise = require("promise");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const webhookRuby = "https://discordapp.com/api/webhooks/525705143044276231/SnI07iJo7sa5gSRrC7b2kiUjG-NyAp-DA-Dkwf3MoZ39sdm65afe3JaKBXk9QJALwRtB";
// const webhookAlliance = "https://discordapp.com/api/webhooks/583455481557942292/v-GptkOFZgNgAsZWhFFNBxoozy1AmdMo_2I0Oia5X2bEtE4k5xEvEkDx-YcI6gvnx63r";
// const webhookSR = "https://discordapp.com/api/webhooks/610176759479926784/okulBTWWtSjX5FETKKN7JMaW6yN1JyEtrtSaRvPemnHrdsfH5vxX_zKLQfum4EYpRP0I";
var almaItems;

exports.handler = function(event, context, callback) {
	var url = "";

	console.log("Event : " + JSON.stringify(event));
	console.log("Context : " + JSON.stringify(context));

	var month = event.month;
	var origin = event.origin;

	console.log("Origin : " + origin + " Month : " + month);

	if (origin === "Ruby") {
		url = webhookRuby;
		let response = {
			statusCode: "200",
			body: "Request received."
		};
		callback(null, response);
	}
	//  else if (origin === "POP") {
	// 	url = webhookAlliance;
	// 	let response = {
	// 		statusCode: "200",
	// 		body: "Request received."
	// 	};
	// 	callback(null, response);
	// } else if (origin === "Silk Road") {
	// 	url = webhookSR;
	// 	let response = {
	// 		statusCode: "200",
	// 		body: "Request received."
	// 	};
	// 	callback(null, response);
	// }
	else {
		console.log("Invalid Origin");
		let response = {
			statusCode: "200",
			body: "INVALID_ORIGIN"
		};
		callback(null, response);
		return;
	}

	var daysInMonth = moment(month, "MM").daysInMonth();
	almaItems = Array(daysInMonth).fill("");

	console.log("The number of days in month " + month + " are : " + daysInMonth);

	var promiseList = [];

	for (var i = 1; i < daysInMonth + 1; i++) {
		promiseList.push(getAlmaDataForDay(month, i));
	}

	Promise.all(promiseList)
		.then(() => {
			console.log("Alma items : " + almaItems.toString());

			sendDataToWebhook(url, month)
				.then(response => {
					console.log("Data sent successfully. Returned response : " + JSON.stringify(response));
					return;
				})
				.catch(err => {
					console.log("Error in sendDataToWebhook : " + JSON.stringify(err));
					return err;
				});
		})
		.catch(err => {
			console.log("Error in getAlmaDataForDay : " + JSON.stringify(err));
			return err;
		});
};

function getAlmaDataForDay(month, day) {
	return new Promise(function(resolve, reject) {
		if (month.length == 1) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day.toString();
		}

		let options = {
			host: "www.krosmoz.com",
			port: 80,
			path: "/en/almanax/2020-" + month + "-" + day
		};

		http
			.get(options, function(res) {
				let almaSiteBody = "";
				res.on("data", function(data) {
					almaSiteBody += data;
				});
				res.on("end", function() {
					getDataFrom(almaSiteBody)
						.then(result => {
							console.log("Data from alma for day " + day + " in month " + month + " : " + JSON.stringify(result));
							almaItems[day - 1] = result;
							return resolve();
						})
						.catch(err => {
							console.log("Error in getDataFrom : " + JSON.stringify(err));
							return reject(err);
						});
				});
			})
			.on("error", function(err) {
				console.log("Error in http get : " + err.message);
				return reject(err);
			});
	});
}

function getDataFrom(almSiteBody) {
	return new Promise(function(resolve) {
		let $ = cheerio.load(almSiteBody, {
			decodeEntities: false
		});

		let offering = $(".more-infos-content").toString();
		offering = offering.split('<p class="fleft">')[1];
		offering = offering.split("</p>")[0];
		offering = offering.split("Find ")[1];
		offering = offering.split(" and take")[0];
		offering = offering.trim();

		return resolve(offering);
	});
}

function sendDataToWebhook(webhookUrl, month) {
	return new Promise(function(resolve) {
		console.log("Url : " + webhookUrl);

		var almaItemsString = almaItems.toString();
		almaItemsString = almaItemsString.split(",").join("\n");

		console.log("Alma items string : " + almaItemsString);

		if (month.length == 1) {
			month = "0" + month;
		}

		var embedData = {
			embeds: [
				{
					color: 16697031,
					fields: [
						{
							name: "All resources needed for Almanax during the month of " + moment(month, "MM").format("MMMM"),
							value: almaItemsString
						}
					]
				}
			]
		};

		console.log("Embed data : " + JSON.stringify(embedData));

		fetch(webhookUrl, {
			method: "post",
			body: JSON.stringify(embedData),
			headers: { "Content-Type": "application/json" }
		})
			.then(res => res.json())
			.then(json => {
				resolve(json);
			});
	});
}
