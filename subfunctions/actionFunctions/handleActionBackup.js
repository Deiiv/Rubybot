const Discord = require("discord.js");
const fs = require('fs-extra');
const prettyBytes = require('pretty-bytes');
const backup = require("discord-backup");
const backupPath = __dirname + "/../../discord-server-backups/";
backup.setStorageFolder(backupPath);
const AWS = require("aws-sdk");
const logger = require("../logger");
const s3 = new AWS.S3();
const bucketName = "rubybot";

var handleActionBackup = function (msg) {
	var messageContent = msg.content.split(" ");
	var message;

	if (msg.author.id != "140904638084808705") {
		message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("You're not allowed to use this command!").setDescription(process.env.pepeCry);
		msg.channel.send(message);
		return;
	}

	if (!messageContent[1]) {
		message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("Proper usage: !backup create OR !backup list OR !backup info X :floppy_disk:");
		msg.channel.send(message);
		return;
	}

	switch (messageContent[1]) {
		// create backup
		case "create":
			message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Backup creation process starting...").setDescription(process.env.pepoG);
			msg.channel.send(message);
			backup.create(msg.guild, {
				jsonBeautify: true,
				saveImages: "base64"
			}).then((backupData) => {
				logger.info("Backup has been created successfully");
				var date = new Date(backupData.createdTimestamp);
				var yyyy = date.getFullYear().toString(), mm = (date.getMonth() + 1).toString(), dd = date.getDate().toString();
				var formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;
				var { size } = fs.statSync(`${backupPath}${backupData.id}.json`);
				message = new Discord.MessageEmbed()
					.setColor(process.env.embedColour)
					.setTitle(`Backup created! ${process.env.peepoHappy}`)
					.addField("Backup ID", backupData.id, false)
					.addField("Server ID", backupData.guildID, false)
					.addField("Size", `${prettyBytes(size)}`, false)
					.addField("Created at", formatedDate, false);
				msg.channel.send(message);
				var params = {
					Body: JSON.stringify(backupData),
					Bucket: bucketName,
					Key: `discord-server-backups/${backupData.id}.json`
				};
				logger.info(`Uploading to S3 to bucket ${params.Bucket} with key ${params.Key}`);
				s3.putObject(params).promise()
					.then(data => {
						logger.info("Response from s3 : " + JSON.stringify(data));
					})
					.catch(err => {
						logger.info(err);
					})
				logger.info("Removing local backup file");
				fs.remove(`${backupPath}${backupData.id}.json`)
					.then(() => {
						logger.info("File removed");
					})
					.catch(err => {
						logger.info(err);
					})
			});
			break;
		// list backups
		case "list":
			message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Backup list command is temporarily disabled!").setDescription(process.env.pepeCry);
			msg.channel.send(message);
			break;
		// get info of a backup
		case "info":
			if (!messageContent[2]) {
				message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Invalid input! Proper usage: !backup create OR !backup list OR !backup info X").setDescription(process.env.pepeCry);
				msg.channel.send(message);
			}
			else {
				message = new Discord.MessageEmbed().setColor(process.env.embedColour).setTitle("Backup info command is temporarily disabled!").setDescription(process.env.pepeCry);
				msg.channel.send(message);
			}
			break;
		default:
			break;
	}
};
module.exports = handleActionBackup;
