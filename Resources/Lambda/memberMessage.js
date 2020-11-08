const fetch = require("node-fetch");
const guildWebhookUrl = "https://discordapp.com/api/webhooks/";
// const allianceWebhookUrl = "https://discordapp.com/api/webhooks/";

exports.handler = function (event, context, callback) {
	console.log("Event : " + JSON.stringify(event));
	console.log("Context : " + JSON.stringify(context));

	var url = guildWebhookUrl;
	// if (event.alliance) {
	//     url = allianceWebhookUrl;
	// };

	var embedData = {
		embeds: [
			{
				color: 16697031,
				fields: [
					{
						name: event.discordid + " sent the following message:",
						value: event.message,
					},
				],
			},
		],
	};

	console.log("Embed data : " + JSON.stringify(embedData));

	fetch(url, {
		method: "post",
		body: JSON.stringify(embedData),
		headers: { "Content-Type": "application/json" },
	})
		.then((res) => {
			console.log("Done", res);
			callback(null, res);
		})
		.catch((err) => {
			console.log("Error in sending data to webhook : ", err);
			callback(err);
		});
};
