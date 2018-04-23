const Discord = require("discord.js");
const Database = require("./database.js");
const messagehandler = require("./messagehandler.js");
const config = require("./config.json");

const client = new Discord.Client();
const data = new Database.TRHDatabase();

data.setup();
messagehandler.init(client, data);
const log = console.log;
String.prototype.contains = String.prototype.includes;

client.login(config.bot.token);

client.on("ready", () => {
    log("Client logged in.");
    client.user.setGame("Developer: Dylan#4049");
});

client.on("message", message => {
    messagehandler.handle(message);
});

client.on("guildMemberAdd", member => {
	const channel = member.guild.channels.find("name", "welcome");
	const introChannel = member.guild.channels.find("name", "introductions");
	const claimChannel = member.guild.channels.find("name", "roles-claim");
    channel.send("Welcome <@" + member.id + "> to **The Resource Hub**! Please introduce yourself in <#" + introChannel.id + "> and claim your roles in <#" + claimChannel.id + ">!");
});
