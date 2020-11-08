var AWS = require("aws-sdk");
var ssm = new AWS.SSM();

exports.handler = function (event, context, callback) {
	console.log("Event : " + JSON.stringify(event));
	if (event.type === "guilds") {
		if (event.action === "get") {
			console.log("Get action.");
			let ssmParams = {
				Name: "/rubybot/guildlist",
			};
			console.log("Calling SSM getParameter with params : " + JSON.stringify(ssmParams));
			ssm
				.getParameter(ssmParams)
				.promise()
				.then((data) => {
					console.log("Data : " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: data.Parameter.Value || "",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log(err);
					callback(err);
				});
		} else if (event.action === "update" && event.value) {
			console.log("Update action.");
			let ssmParams = {
				Name: "/rubybot/guildlist",
				Value: event.value,
				Type: "StringList",
				Overwrite: true,
			};
			console.log("Calling SSM putParameter with params : " + JSON.stringify(ssmParams));
			ssm
				.putParameter(ssmParams)
				.promise()
				.then((data) => {
					console.log("Data : " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: "Parameter updated",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log(err);
					callback(err);
				});
		} else {
			callback(new Error("Invalid action, or missing parameters"));
		}
	} else if (event.type === "roles") {
		const regex = /\b \b|\b'\b/g;
		var guild = event.guild.replace(regex, "");
		if (event.action === "get" && guild) {
			console.log("Get action.");
			let ssmParams = {
				Name: "/rubybot/roles/" + guild + "/list",
			};
			console.log("Calling SSM getParameter with params : " + JSON.stringify(ssmParams));
			ssm
				.getParameter(ssmParams)
				.promise()
				.then((data) => {
					console.log("Data : " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: data.Parameter.Value || "",
					};
					callback(null, response);
				})
				.catch((err) => {
					if (err.code === "ParameterNotFound") {
						console.log("Param not found");
						const response = {
							statusCode: 200,
							body: "",
						};
						callback(null, response);
					} else {
						console.log(err);
						callback(err);
					}
				});
		} else if (event.action === "update" && event.value && guild) {
			console.log("Update action.");
			let ssmParams = {
				Name: "/rubybot/roles/" + guild + "/list",
				Value: event.value,
				Type: "StringList",
				Overwrite: true,
			};
			console.log("Calling SSM putParameter with params : " + JSON.stringify(ssmParams));
			ssm
				.putParameter(ssmParams)
				.promise()
				.then((data) => {
					console.log("Data : " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: "Parameter updated",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log(err);
					callback(err);
				});
		} else {
			callback(new Error("Invalid action, or missing parameters"));
		}
	} else {
		callback(new Error("Invalid type"));
	}
};
