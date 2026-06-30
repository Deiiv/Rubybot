const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({ region: process.env.AWS_REGION || "us-east-1" });

exports.handler = function (event, context, callback) {
	console.log("Event : " + JSON.stringify(event));
	if (event.type === "guilds") {
		if (event.action === "get") {
			console.log("Get action for guilds.");
			let ssmParams = {
				Name: "/rubybot/guildlist",
			};
			console.log("Calling SSM getParameter with params : " + JSON.stringify(ssmParams));
			const getCommand = new GetParameterCommand(ssmParams);
			ssmClient
				.send(getCommand)
				.then((data) => {
					console.log("Successfully retrieved parameter: " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: data.Parameter.Value || "",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log("Error retrieving parameter: " + err.message);
					console.log(err);
					callback(err);
				});
		} else if (event.action === "update" && event.value) {
			console.log("Update action for guilds.");
			let ssmParams = {
				Name: "/rubybot/guildlist",
				Value: event.value,
				Type: "StringList",
				Overwrite: true,
			};
			console.log("Calling SSM putParameter with params : " + JSON.stringify(ssmParams));
			const putCommand = new PutParameterCommand(ssmParams);
			ssmClient
				.send(putCommand)
				.then((data) => {
					console.log("Successfully updated parameter: " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: "Parameter updated",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log("Error updating parameter: " + err.message);
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
			console.log("Get action for roles with guild: " + guild);
			let ssmParams = {
				Name: "/rubybot/roles/" + guild + "/list",
			};
			console.log("Calling SSM getParameter with params : " + JSON.stringify(ssmParams));
			const getCommand = new GetParameterCommand(ssmParams);
			ssmClient
				.send(getCommand)
				.then((data) => {
					console.log("Successfully retrieved parameter: " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: data.Parameter.Value || "",
					};
					callback(null, response);
				})
				.catch((err) => {
					if (err.code === "ParameterNotFound") {
						console.log("Parameter not found for guild: " + guild);
						const response = {
							statusCode: 200,
							body: "",
						};
						callback(null, response);
					} else {
						console.log("Error retrieving parameter: " + err.message);
						console.log(err);
						callback(err);
					}
				});
		} else if (event.action === "update" && event.value && guild) {
			console.log("Update action for roles with guild: " + guild);
			let ssmParams = {
				Name: "/rubybot/roles/" + guild + "/list",
				Value: event.value,
				Type: "StringList",
				Overwrite: true,
			};
			console.log("Calling SSM putParameter with params : " + JSON.stringify(ssmParams));
			const putCommand = new PutParameterCommand(ssmParams);
			ssmClient
				.send(putCommand)
				.then((data) => {
					console.log("Successfully updated parameter: " + JSON.stringify(data));
					const response = {
						statusCode: 200,
						body: "Parameter updated",
					};
					callback(null, response);
				})
				.catch((err) => {
					console.log("Error updating parameter: " + err.message);
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
