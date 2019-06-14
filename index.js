require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const validGuilds = ["Ruby", "Silk Road", "Rookies", "Forgotten"];
var monkaThink, hypers, pepeRuby, pepeCry, peepoHappy;

client.on("ready", () => {
	console.log('Logged in as:');
	console.log(client.user.username + " " + client.user.id);
	console.log('\nConnected to the following servers:');
	client.guilds.forEach(function(guild){
		console.log(guild.name + " " + guild.id);
		// if(guild.name === "x") guild.leave();
	});
	console.log('------------------------------\n');

	hypers = client.emojis.find(emoji => emoji.name === "hypers") || "";
	pepeRuby = client.emojis.find(emoji => emoji.name === "pepeRuby") || "";
	monkaThink = client.emojis.find(emoji => emoji.name === "monkaThink") || "";
	pepeCry = client.emojis.find(emoji => emoji.name === "pepeCry") || "";
	peepoHappy = client.emojis.find(emoji => emoji.name === "peepoHappy") || "";
});

//new member event
client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'welcome');
	if (!channel) return;

	let message = "Welcome to the server, <@" + member.id + ">! " + pepeRuby;

	if(member.guild.name === "Test"){ //POP
		message += "\n\nCheck out our rules/info in the " + member.guild.channels.find(ch => ch.name === 'information').toString() + " channel " + hypers + "\n\nSet your role with '!setguild <guild>'\nWhere <guild> is one of the following:\n" + validGuilds.toString();
	}
	else{
		message += "\n\nPlease check out our rules/info in the " + member.guild.channels.find(ch => ch.name === 'information').toString() + " channel " + hypers;
	}
	channel.send(message);
});

//message event
client.on('message', msg => {
	if (msg.author.bot) return;

	if (msg.content.startsWith('!help')) {
		// msg.reply('help menu'); how to reply to a specific person
		msg.channel.send('help menu');
	}

	if (msg.content.startsWith('!setguild')) {
		var message = "";

		let guild = msg.content.substring(10);
		
		if(guild && validGuilds.includes(guild)){
			if(msg.member.roles.find(r => r.name === guild)){
				msg.channel.send('You already have the ' + guild + ' role ' + monkaThink);
				return;
			}

			let shortList = validGuilds.filter(item => item !== guild);
			shortList.forEach(function(guildRole){
				if(msg.member.roles.find(r => r.name === guildRole)){
					let oldRole = msg.guild.roles.find(role => role.name === guildRole);
					msg.member.removeRole(oldRole)
						.then(() => {
							message += "Removed previous role for guild " + guildRole + " " + pepeCry + "\n";
						})
						.catch(error => {
							console.log(error);
							msg.channel.send('Encountered an error: ' + error.message);
						});
				}
			})

			let role = msg.guild.roles.find(role => role.name === guild);
			if(!role){
				msg.channel.send("Role for guild " + guild + " not found");
			}
			else{
				msg.member.addRole(role)
					.then(() => {
						message += 'Set role for guild ' + guild + " " + peepoHappy;
						msg.channel.send(message);
					})
					.catch(error => {
						console.log(error);
						msg.channel.send('Encountered an error: ' + error.message);
					});
			}
		}
		else{
			msg.channel.send('Invalid guild! Please send one of the following: ' + validGuilds.toString());
		}
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