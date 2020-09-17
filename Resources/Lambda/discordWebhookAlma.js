const fetch = require("node-fetch");
const http = require("http");
const promise = require("promise");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const webhookUrls = ["https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/", "https://discord.com/api/webhooks/"];

exports.handler = function (event, context) {
	console.log("Event : " + JSON.stringify(event));
	console.log("Context : " + JSON.stringify(context));

	var options = {
		host: "www.krosmoz.com",
		port: 80,
		path: "/en/almanax",
	};

	http
		.get(options, function (res) {
			var almaSiteBody = "";
			res.on("data", function (data) {
				almaSiteBody += data;
			});
			res.on("end", function () {
				console.log("Body : ", almaSiteBody);
				getDataFrom(almaSiteBody)
					.then((result) => {
						console.log("Data from alma : " + JSON.stringify(result));
						var counter = 0;
						webhookUrls.forEach(function (url) {
							counter += 1;
							sendDataToWebhook(result, url)
								.then((response) => {
									console.log("Data sent successfully. Returned response : ", response);
									if (counter == webhookUrls.length) {
										return;
									}
								})
								.catch((err) => {
									console.log("Error in sendDataToWebhook : ", err);
									return err;
								});
						});
					})
					.catch((err) => {
						console.log("Error in getDataFrom : ", err);
						return err;
					});
			});
		})
		.on("error", function (err) {
			console.log("Error in http get : ", err);
			return err;
		});
};

function getDataFrom(almSiteBody) {
	return new Promise(function (resolve) {
		let $ = cheerio.load(almSiteBody, {
			decodeEntities: false,
		});

		let data = {
			image: "",
			offering: "",
			bonus: "",
		};

		let offering = $(".more-infos-content").toString();
		offering = offering.split('<p class="fleft">')[1];
		offering = offering.split("</p>")[0];
		offering = offering.trim();
		data.offering = offering;

		let bonus = $(".mid").toString();
		bonus = bonus.split('<div class="more">')[1];
		bonus = bonus.split("<div")[0];
		bonus = bonus.split("<b>").join("");
		bonus = bonus.split("</b>").join("");
		bonus = bonus.trim();
		data.bonus = bonus;

		let image = $(".more-infos-content").toString();
		image = image.split('<img src="')[1];
		image = image.split('">')[0];
		image = image.trim();
		data.image = image;

		resolve(data);
	});
}

function sendDataToWebhook(data, webhookUrl) {
	return new Promise(function (resolve, reject) {
		var embedData = {
			embeds: [
				{
					author: {
						name: "Almanax for " + moment().tz("Europe/Paris").format("MMMM Do"),
						url: "http://www.krosmoz.com/en/almanax",
					},
					color: 16697031,
					fields: [
						{
							name: ":calendar_spiral: Offering:",
							value: data.offering,
						},
						{
							name: ":money_mouth: Bonus:",
							value: data.bonus,
						},
					],
					thumbnail: {
						url: data.image,
					},
				},
			],
		};

		console.log("Embed data : " + JSON.stringify(embedData));

		fetch(webhookUrl, {
			method: "post",
			body: JSON.stringify(embedData),
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => {
				console.log("Request succeeded with JSON response", data);
			})
			.catch((error) => {
				console.log("Request failed", error);
			});
	});
}
