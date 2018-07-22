const config = require("../config/config.json");
const mysql = require("mysql2/promise");
const log = console.log;

var connection = undefined;

function getConnection() {
	return connection;
}

async function connect() {
	log("Creating database connection.");
	const conf = config.database;
	const start = new Date().getTime();
	connection = await mysql.createConnection({
		host: conf.host,
		user: conf.user,
		password: conf.password,
		database: conf.database
	});
	log("Connection created in " + (new Date().getTime() - start) + "ms.");
	return getConnection();
}

async function getAbout(id) {
	const [rows] = await getConnection().query("SELECT about, insert_time FROM rt_about WHERE user_id = ?", [id]);
	if (rows.length == 0) {
		return "No about specified for this user.";
	}
	const result = rows[0];
	return {
		about: result.about,
		date: result.insert_time
	};
}

async function setAbout(id, message) {
	await getConnection().query("INSERT INTO rt_about (user_id, about, insert_time) VALUES(?, ?, NOW()) ON DUPLICATE KEY UPDATE about = ?, insert_time = NOW()", [id, message, message]);
}

async function getVouches(id) {
	const [rows] = await getConnection().query("SELECT user_id, trusted, reason, insert_time FROM rt_vouches WHERE vouched_id = ?", [id])
	const vouches = [];
	for (let result of rows) {
		vouches.push({
			userId: result.user_id,
			trusted: result.trusted,
			reason: result.reason,
			date: result.insert_time
		});
	}
	return vouches;
}

module.exports = {
	connect: connect,
	getAbout: getAbout,
	setAbout: setAbout,
	getVouches: getVouches
};