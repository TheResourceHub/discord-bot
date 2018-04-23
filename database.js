const config = require("./config.json");
const mysql = require("mysql");

const log = console.log;

class TRHDatabase {
	setup() {
		const conf = config.database;
		this.connection = mysql.createConnection({
			host: conf.host,
			user: conf.user,
			password: conf.password,
			database: conf.database
		});
		this.connect();
	}

	connect() {
		this.connection.connect(error => {
			if (error != null) {
				log("[TRHDatabase] Could not connect to the database.");
				log(error);
				return;
			}
			log("Connected to the database.");
		});
	}
	
	getAbout(id, callback) {
		this.connection.query("SELECT about FROM rt_about WHERE user_id = ?", [id], (error, results, fields) => {
			const result = results[0];
			if (!result) {
				callback("No about specified for this user.");
				return;
			}
			callback(result["about"]);
		});
	}

	setAbout(id, message) {
		this.connection.query("INSERT INTO rt_about (user_id, about) VALUES(?, ?) ON DUPLICATE KEY UPDATE about = ?", [id, message, message]);
	}
}

module.exports = {
	TRHDatabase
};
