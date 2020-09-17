/**
 * Created by ryanwelcher on 2017-04-07.
 */

const tweetsToSend = {};
let firstRun = false;

const getGutenbergTickets = require('./src/github');
const getTracTickets = require('./src/trac');
const sendATweet = require('./src/sendATweet');

async function getTickets() {
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
	if (firstRun) {
		console.log('Auto tweeting on first run');
		sendATweet(tweetsToSend);
		firstRun = false;
	}
}

// Start the show!
getTickets();
setInterval(() => {
	if (!Object.keys(tweetsToSend).length) {
		getTickets();
	}
}, 30 * 60 * 1000);
setInterval(() => {
	sendATweet(tweetsToSend);
}, 15 * 60 * 1000);
