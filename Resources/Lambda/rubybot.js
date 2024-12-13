import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = DynamoDBDocument.from(new DynamoDB());

export const handler = (event, context, callback) => {
	// exports.handler = function(event, context, callback) {
	console.log(event);

	if (event.action === "view") {
		//view others
		if (!event.id && event.username) {
			let scanParams = {
				ExpressionAttributeValues: {
					":username": event.username
				},
				FilterExpression: "UserName = :username",
				TableName: "Dofus-user-data"
			};
			console.log("Scan params", scanParams);

			const command = new ScanCommand(scanParams);

			dynamodb
				.send(command)
				.then(data => {
					// console.log(result);
					// var data = AWS.DynamoDB.Converter.unmarshall(result.Items[0]);
					console.log(data);

					if (data.Count === 0) {
						let response = {
							statusCode: 200,
							body: "NONE"
						};
						callback(null, response);
					}

					var profList = [];
					var guild = "";

					for (var item in data.Items[0]) {
						if (item != "UserId" && item != "UserName") {
							if (item === "Guild") {
								guild = data.Items[0][item];
							} else {
								profList.push({
									prof: item,
									level: data.Items[0][item]
								});
							}
						}
					}

					profList = profList.sort(function (a, b) {
						return b.level - a.level;
					});

					let profString = "";

					profList.forEach(function (prof) {
						if (prof.level && prof.level >= 1) {
							if (profString != "") profString += "\n";
							profString += prof.prof + " - " + prof.level;
						}
					});

					console.log("Guild : " + guild + " | ProfList : " + profString);

					var body = JSON.stringify({
						guild: guild,
						profList: profString
					});

					if (Object.entries(data).length === 0 && data.constructor === Object) {
						body = JSON.stringify({});
					}

					let response = {
						statusCode: 200,
						body: body
					};
					callback(null, response);
				})
				.catch(error => {
					console.log(error);
					let response = {
						statusCode: 200,
						body: error.message
					};
					callback(null, response);
				});
		}
		//view own
		else {
			let command = new GetCommand({
				Key: {
					UserId: event.id
				},
				TableName: "Dofus-user-data"
			});

			dynamodb
				.send(command)
				.then(data => {
					// console.log(result);
					// var data = AWS.DynamoDB.Converter.unmarshall(result.Item);
					console.log(data);

					var profList = [];
					var guild = "";
					var username = "";

					for (var item in data.Item) {
						// console.log("item : ", item);
						if (item === "UserName") {
							username = data.Item[item];
						}
						if (item != "UserId" && item != "UserName") {
							if (item === "Guild") {
								guild = data.Item[item];
							} else {
								profList.push({
									prof: item,
									level: data.Item[item]
								});
							}
						}
					}

					profList = profList.sort(function (a, b) {
						return b.level - a.level;
					});

					let profString = "";

					profList.forEach(function (prof) {
						if (prof.level && prof.level >= 1) {
							if (profString != "") profString += "\n";
							profString += prof.prof + " - " + prof.level;
						}
					});

					console.log("Guild : " + guild + " | ProfList : " + profString);

					var body = JSON.stringify({
						guild: guild,
						profList: profString,
						username: username
					});

					if (Object.entries(data).length === 0 && data.constructor === Object) {
						body = JSON.stringify({});
					}

					let response = {
						statusCode: 200,
						body: body
					};
					callback(null, response);
				})
				.catch(error => {
					console.log(error);
					let response = {
						statusCode: 200,
						body: error.message
					};
					callback(null, response);
				});
		}
	}

	if (event.action === "getProf") {
		let scanParams = {
			FilterExpression: "attribute_exists(" + event.prof + ")",
			TableName: "Dofus-user-data",
			ExpressionAttributeNames: {
				"#PROF": event.prof,
				"#USERNAME": "UserName",
				"#GUILD": "Guild"
			},
			ProjectionExpression: "#PROF, #USERNAME, #GUILD"
		};
		console.log("Scan params", scanParams);
		dynamodb
			.scan(scanParams)
			.promise()
			.then(result => {
				console.log(result);
				var data = [];
				result.Items.forEach(function (item) {
					data.push(AWS.DynamoDB.Converter.unmarshall(item));
				});
				console.log(data);

				if (data.length === 0) {
					let response = {
						statusCode: 200,
						body: "NONE"
					};
					callback(null, response);
				}

				data = data.sort(function (a, b) {
					return b[event.prof] - a[event.prof];
				});

				let profString = "";
				let limit = parseInt(event.limit);
				let count = 0;

				data.forEach(function (item) {
					let levelInt = parseInt(item[event.prof], 10);
					let eventLevelInt = parseInt(event.level, 10);
					if (levelInt >= eventLevelInt) {
						if (profString != "") profString += "\n";
						let guild = "";
						if (item.Guild) {
							guild = " - " + item.Guild;
						}
						if (count < limit) profString += item[event.prof] + " - " + item.UserName + guild;
						count++;
					}
				});

				console.log("Sorted string: " + profString);

				var body = JSON.stringify({
					string: profString
				});

				let response = {
					statusCode: 200,
					body: body
				};
				callback(null, response);
			})
			.catch(error => {
				console.log(error);
				let response = {
					statusCode: 200,
					body: error.message
				};
				callback(null, response);
			});
	}

	if (event.action === "updateuser") {
		if (!event.id || !event.username) {
			let response = {
				statusCode: 200,
				body: "Missing some fields"
			};
			callback(null, response);
		}

		let updateParams = {
			ExpressionAttributeNames: {
				"#NAME": "UserName",
				"#GUILD": "Guild"
			},
			ExpressionAttributeValues: {
				":NAME": {
					S: event.username
				},
				":GUILD": {
					S: event.guild || "None"
				}
			},
			Key: {
				UserId: {
					S: event.id
				}
			},
			ReturnValues: "ALL_NEW",
			TableName: "Dofus-user-data",
			UpdateExpression: "SET #NAME = :NAME, #GUILD = :GUILD"
		};

		console.log("Calling DynamoDB with params : " + JSON.stringify(updateParams));

		dynamodb
			.updateItem(updateParams)
			.promise()
			.then(result => {
				console.log("Updated data for " + event.username);
				let response = {
					statusCode: 200,
					body: "Updated data for " + event.username
				};
				callback(null, response);
			})
			.catch(error => {
				console.log(error);
				let response = {
					statusCode: 200,
					body: error.message
				};
				callback(null, response);
			});
	}

	if (event.action === "updateprof") {
		if (!event.id || !event.username || !event.prof || !event.level) {
			let response = {
				statusCode: 200,
				body: "Missing some fields"
			};
			callback(null, response);
		}

		let updateParams = {
			ExpressionAttributeNames: {
				"#NAME": "UserName",
				"#PROF": event.prof
			},
			ExpressionAttributeValues: {
				":NAME": {
					S: event.username
				},
				":PROF": {
					S: event.level
				}
			},
			Key: {
				UserId: {
					S: event.id
				}
			},
			ReturnValues: "ALL_NEW",
			TableName: "Dofus-user-data",
			UpdateExpression: "SET #NAME = :NAME, #PROF = :PROF"
		};

		console.log("Calling DynamoDB with params : " + JSON.stringify(updateParams));

		dynamodb
			.updateItem(updateParams)
			.promise()
			.then(result => {
				console.log("Updated data : " + JSON.stringify(result));
				let response = {
					statusCode: 200,
					body: "Updated data for " + event.username
				};
				callback(null, response);
			})
			.catch(error => {
				console.log(error);
				let response = {
					statusCode: 200,
					body: error.message
				};
				callback(null, response);
			});
	}
};
