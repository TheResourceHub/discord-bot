const log = console.log;
let data;
let client;
String.prototype.contains = String.prototype.includes;

function init(initClient, sql) {
	data = sql;
	client = initClient;
}

function getChannel(message) {
	return message.guild.channels.find("name", "bot");
}

function sendMessage(message, s) {
	const channel = getChannel(message);
	channel.send(s);
}

function getUserIdFromString(text) {
	if (!text || !(text.contains("<") && text.contains(">") && text.contains("@"))) {
		return undefined;
	}
	text = text.replace("<", "");
	text = text.replace("@", "");
	text = text.replace("!", "");
	text = text.replace(">", "");
	return text;
}

function handleAbout(message) {
	const author = message.author;
	const msg = message.content;
	const userId = getUserIdFromString(msg.split(" ")[1]);
	if (!userId) {
		sendMessage(message, "<@" + message.author.id + ">, you must tag a user.");
		return;
	}
	data.getAbout(userId, about => {
		sendMessage(message, "<@" + message.author.id + ">, ```\n" + about + "\n```");
	});
}

function handleSetAbout(message) {
	const author = message.author;
	const msg = message.content;
	const aboutMessage = msg.substring("!setabout ".length);
	if (aboutMessage.length < 1) {
		sendMessage(message, "<@" + message.author.id + ">, you must enter a message!");
		return;
	}
	sendMessage(message, "<@" + message.author.id + ">, setting your about message to:\n```" + aboutMessage + "```");
	data.setAbout(author.id, aboutMessage);
}

function handle(message) {
	const author = message.author;
	const msg = message.content;
	if (!msg.startsWith("!")) {
		return;
	}
	
	log(author.username + "#" + author.discriminator + ": " + msg);

	const command = msg.split(" ")[0].replace("!", "").toLowerCase();
	switch (command) {
		case "about":
			handleAbout(message);
			break;
		case "setabout":
			handleSetAbout(message);
			break;
		default: break;
	}
}

module.exports = {
	init,
	handle
};