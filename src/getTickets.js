const getGutenbergTickets = require('./github');
const getTracTickets = require('./trac');

module.exports = async function getTickets() {
	const tweetsToSend = {};
	const [trac, gb] = await Promise.all([getTracTickets(), getGutenbergTickets()]);
	const tickets = [...trac, ...gb];
	const tweetKeys = Object.keys(tweetsToSend);
	tickets.forEach((ticket) => {
		const { issue, url, title, type } = ticket;
		if (!tweetKeys.some((key) => key === type + issue)) {
			console.log(`Adding ${type}${issue} to queue`);
			tweetsToSend[type + issue] = {
				type,
				issue,
				title,
				url,
			};
		}
	});
	return tweetsToSend;
};
