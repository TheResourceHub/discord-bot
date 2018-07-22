function getChannel(message) {
	return message.guild.channels.find("name", "bot");
}

function sendMessage(message, s) {
	return getChannel(message).send(s);
}

function getUserIdFromString(text) {
	if (!text || !(text.includes("<") && text.includes(">") && text.includes("@"))) {
		return undefined;
	}
	return text.replace(/[<@!>]/g, "");
}

function getMaxRole(guildMember) {
	var maxRole = undefined;
	guildMember.roles.forEach(role => {
		if (!maxRole) {
			maxRole = role;
			return;
		}
		if (maxRole.calculatedPosition > role.calculatedPosition) {
			return;
		}
		maxRole = role;
	});
	return maxRole;
}

module.exports = {
	getChannel: getChannel,
	sendMessage: sendMessage,
	getUserIdFromString: getUserIdFromString,
	getMaxRole: getMaxRole
};