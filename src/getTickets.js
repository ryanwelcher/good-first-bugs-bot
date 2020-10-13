const getGutenbergTickets = require('./github');
const getTracTickets = require('./trac');
const mockTickets = require('../test/mocks/mock-tickets.json');

module.exports = async function getTickets() {
	const tweetsToSend = {};
	let tickets;
	if (process.env.NODE_ENV === 'production') {
		const [trac, gb] = await Promise.all([getTracTickets(), getGutenbergTickets()]);
		tickets = [...trac, ...gb];
	} else {
		tickets = mockTickets;
	}

	const tweetKeys = Object.keys(tweetsToSend);
	tickets.forEach((ticket) => {
		const { issue, url, title, type } = ticket;
		if (!tweetKeys.some((key) => key === type + issue)) {
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
