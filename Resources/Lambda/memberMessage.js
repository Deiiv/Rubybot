const fetch = require("node-fetch");
const guildWebhookUrl = "https://discordapp.com/api/webhooks/630524976960897052/J1i3PpHXpdgLGZv1FsKQ91wPYpi7ksPH1s24GRRCH-ZlECUvZxWiz1MXrA0WevXTr_0M";
// const allianceWebhookUrl = "https://discordapp.com/api/webhooks/632340149564604469/LStOHI8kOc1QwPda_NTyUhxUoJKYIKyWE8R-tb89IUVNcQnLlkOG5wo_Z67P2QPAKagW";

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
