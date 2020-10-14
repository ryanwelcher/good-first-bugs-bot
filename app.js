/**
 * Created by ryanwelcher on 2017-04-07.
 */

const { generateTweetStatus } = require('./src/utils/tweet-status');
const { selectTicket } = require('./src/utils/select-ticket');

const getTickets = require('./src/getTickets');
const sendATweet = require('./src/sendATweet');

let firstRun = true;
const HALF_HOUR = 30 * 60 * 1000;
const FIFTEEN_MINUTES = HALF_HOUR / 2;

(async function () {
	let tweetsToSend = await getTickets();
	if (firstRun) {
		console.log('Auto tweeting on first run');
		const { ticket, index } = selectTicket(tweetsToSend);
		const status = generateTweetStatus(ticket);
		sendATweet(status);
		delete tweetsToSend[index];
		console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
		firstRun = false;
	}
	setInterval(async () => {
		if (!Object.keys(tweetsToSend).length) {
			tweetsToSend = await getTickets();
		}
	}, HALF_HOUR);
	setInterval(() => {
		if (Object.keys(tweetsToSend).length) {
			const { ticket, index } = selectTicket(tweetsToSend);
			const status = generateTweetStatus(ticket);
			sendATweet(status);
			delete tweetsToSend[index];
			console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
		}
	}, FIFTEEN_MINUTES);
})();
