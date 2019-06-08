require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

client.on("ready", () => {
	console.log('Logged in as:');
	console.log(client.user.name);
	console.log(client.user.id);
	console.log('------');
});

client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith('!help')) {
		// msg.reply('help menu'); how to reply to a specific person
		msg.channel.send('help menu');
	}

	if (msg.content.startsWith('!test')) {
		let message = {
			username: msg.author.username,
			id: msg.author.id
		};
		fetch(process.env.rubybotApi + "data/adduser", {
			method: 'post',
			body:    JSON.stringify(message),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.text())
		.then(body => {
			console.log(body);
			msg.channel.send("Got response from API: " + body);
		})
		.catch(err => {
			console.log("Error in fetch");
			console.log(err);
			msg.channel.send("Encountered an error!");
		});
	}
})

client.login(process.env.clientkey)