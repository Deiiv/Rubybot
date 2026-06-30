const { EmbedBuilder } = require("discord.js");
const fs = require('fs-extra');
const prettyBytes = require('pretty-bytes');
const backup = require("discord-backup");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const backupPath = __dirname + "/../../discord-server-backups/";
backup.setStorageFolder(backupPath);
const logger = require("../logger");

const s3Client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const bucketName = "rubybot";

var handleActionBackup = function (msg) {
	var messageContent = msg.content.split(" ");
	var message;

	if (msg.author.id != "140904638084808705") {
		message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("You're not allowed to use this command!").setDescription(process.env.pepeCry);
		msg.channel.send({ embeds: [message] });
		return;
	}

	if (!messageContent[1]) {
		message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Invalid input!").setDescription("Proper usage: !backup create OR !backup list OR !backup info X :floppy_disk:");
		msg.channel.send({ embeds: [message] });
		return;
	}

	switch (messageContent[1]) {
		// create backup
		case "create":
			message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Backup creation process starting...").setDescription(process.env.pepoG);
			msg.channel.send({ embeds: [message] });
			backup.create(msg.guild, {
				jsonBeautify: true,
				saveImages: "base64"
			}).then((backupData) => {
				logger.info("Backup has been created successfully");
				var date = new Date(backupData.createdTimestamp);
				var yyyy = date.getFullYear().toString(), mm = (date.getMonth() + 1).toString(), dd = date.getDate().toString();
				var formatedDate = `${yyyy}/${(mm[1] ? mm : "0" + mm[0])}/${(dd[1] ? dd : "0" + dd[0])}`;
				var { size } = fs.statSync(`${backupPath}${backupData.id}.json`);
				message = new EmbedBuilder()
					.setColor(process.env.embedColour)
					.setTitle(`Backup created! ${process.env.peepoHappy}`)
					.addFields(
						{ name: 'Backup ID', value: backupData.id },
						{ name: 'Server ID', value: backupData.guildID },
						{ name: 'Size', value: `${prettyBytes(size)}` },
						{ name: 'Created at', value: formatedDate },
					);
				msg.channel.send({ embeds: [message] });
				var params = {
					Body: JSON.stringify(backupData),
					Bucket: bucketName,
					Key: `discord-server-backups/${backupData.id}.json`
				};
				logger.info(`Uploading backup to S3 bucket '${params.Bucket}' with key '${params.Key}', size: ${prettyBytes(size)}`);
				const uploadCommand = new PutObjectCommand(params);
				s3Client.send(uploadCommand)
					.then(data => {
						logger.info(`Successfully uploaded backup ${backupData.id} to S3`);
					})
					.catch(err => {
						logger.error(`Failed to upload backup to S3: ${err.message}`);
						logger.error(err);
					})
				logger.info(`Removing local backup file: ${backupPath}${backupData.id}.json`);
				fs.remove(`${backupPath}${backupData.id}.json`)
					.then(() => {
						logger.info("Local backup file removed successfully");
					})
					.catch(err => {
						logger.error(`Failed to remove local backup file: ${err.message}`);
						logger.error(err);
					})
			});
			break;
		// list backups
		case "list":
			message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Backup list command is temporarily disabled!").setDescription(process.env.pepeCry);
			msg.channel.send({ embeds: [message] });
			break;
		// get info of a backup
		case "info":
			if (!messageContent[2]) {
				message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Invalid input! Proper usage: !backup create OR !backup list OR !backup info X").setDescription(process.env.pepeCry);
				msg.channel.send({ embeds: [message] });
			}
			else {
				message = new EmbedBuilder().setColor(process.env.embedColour).setTitle("Backup info command is temporarily disabled!").setDescription(process.env.pepeCry);
				msg.channel.send({ embeds: [message] });
			}
			break;
		default:
			break;
	}
};
module.exports = handleActionBackup;
