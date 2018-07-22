const Utils = require("../utils/utils");
const log = console.log;
let data;
let client;
let Discord;
const messageHandlers = {};

function init(initClient, sql, discord) {
	client = initClient;
	data = sql;
	Discord = discord;
	registerListeners();
}

function registerCommand(command, handler) {
	messageHandlers[command] = handler;
}

function handleMessage(message) {
	const author = message.author;
	const msg = message.content;
	if (!msg.startsWith("!")) {
		return;
	}
	const command = msg.split(" ")[0].replace("!", "").toLowerCase();
	if (!messageHandlers[command]) {
		return
	}
	log(author.username + "#" + author.discriminator + ": " + msg);
	messageHandlers[command](message);
}

registerCommand("about", async message => {
	const author = message.author;
	const userId = Utils.getUserIdFromString(message.content.split(" ")[1]);
	if (!userId) {
		Utils.sendMessage(message, "<@" + author.id + ">, you must tag a user.");
		return;
	}
	const about = await data.getAbout(userId);
	const guildMember = message.guild.members.find("id", userId);
	const user = guildMember.user;
	const embed = new Discord.RichEmbed()
		.setAuthor(user.username + "#" + user.discriminator, user.avatarURL)
		.setColor(Utils.getMaxRole(guildMember).color)
		.setTitle(user.username + "'s About Message")
		.addField("Last Updated Time", about.date ? about.date : "A while ago.")
		.addField("About Message", about.about)
		.setTimestamp(about.date)
		.setThumbnail(user.avatarURL);

		Utils.sendMessage(message, embed).catch(error => {
		message.reply("<@136144900650565633>, " + error.toString());
	});
});

registerCommand("setabout", async message => {
	const authorId = message.author.id;
	const aboutMessage = message.content.substring("!setabout ".length);
	if (aboutMessage.length < 1) {
		Utils.sendMessage(message, "<@" + authorId + ">, you must enter a message!");
		return;
	}
	Utils.sendMessage(message, "<@" + authorId + ">, setting your about message to:\n```" + aboutMessage + "```");
	data.setAbout(authorId, aboutMessage);
});

/*registerCommand("roles", async message => {
	message.guild.roles.forEach(role => {
		if (role.name.includes("everyone")) {
			return; // No thank you.
		}
		Utils.getChannel(message).send(role.calculatedPosition + " - " + role.name);
	});
});*/

registerCommand("vouches", async message => {
	// TODO
});

function logDeletion(message) {
	const author = message.author;
	const embed = new Discord.RichEmbed()
		.setAuthor(author.username + "#" + author.discriminator, author.avatarURL)
		.setColor("0xFF0000")
		.setFooter("Developer: Dylan#4049")
		.setDescription("Message deleted.")
		.addField("Channel:", message.channel.toString())
		.addField("Message:", message.content)
		.setTimestamp(new Date());

	message.guild.channels.find("name", "server-log").send(embed);
}

function registerListeners() {
	client.on("message", message => handleMessage(message));
	client.on("messageDelete", logDeletion);
	client.on("messageDeleteBulk", messages => message.values().forEach(logDeletion));
	client.on("guildMemberAdd", member => {
		const channel = member.guild.channels.find("name", "welcome");
		const introChannel = member.guild.channels.find("name", "introductions");
		const claimChannel = member.guild.channels.find("name", "roles-claim");
		channel.send("Welcome <@" + member.id + "> to **The Resource Hub**! Please introduce yourself in <#" + introChannel.id + "> and claim your roles in <#" + claimChannel.id + ">!");
	});
}

module.exports = {
	init,
	handleMessage
};