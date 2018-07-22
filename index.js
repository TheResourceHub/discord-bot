const Discord = require("discord.js");
const database = require("./database/database.js");
const messagehandler = require("./handlers/messagehandler");
const config = require("./config/config.json");
const client = new Discord.Client();
const log = console.log;

database.connect();
client.login(config.bot.token);
messagehandler.init(client, database, Discord);

client.on("ready", () => {
	log("Client logged in.");
	client.user.setActivity(config.bot.game);
});