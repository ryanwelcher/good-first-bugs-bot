/**
 * Created by ryanwelcher on 2017-04-07.
 */

import { generateTweetStatus } from './utils/tweet-status.js';
import { selectTicket } from './utils/select-ticket.js';
import getTickets from './getTickets.js';

// const { generateTweetStatus } = require('./utils/tweet-status');
// const { selectTicket } = require('./utils/select-ticket');

// const getTickets = require('./getTickets');
// const sendATweet = require('./sendATweet');

const firstRun = true;
const HALF_HOUR = 30 * 60 * 1000;
const FIFTEEN_MINUTES = HALF_HOUR / 2;

(async function () {
	const tweetsToSend = await getTickets();
	console.log(tweetsToSend);
	// if (firstRun) {
	// 	console.log('Auto tweeting on first run');
	// 	const { ticket, index } = selectTicket(tweetsToSend);
	// 	// const status = generateTweetStatus(ticket);
	// 	// sendATweet(status);
	// 	delete tweetsToSend[index];
	// 	console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
	// 	firstRun = false;
	// }
	// setInterval(async () => {
	// 	if (!Object.keys(tweetsToSend).length) {
	// 		// tweetsToSend = await getTickets();
	// 	}
	// }, HALF_HOUR);
	// setInterval(() => {
	// 	if (Object.keys(tweetsToSend).length) {
	// 		const { ticket, index } = selectTicket(tweetsToSend);
	// 		// const status = generateTweetStatus(ticket);
	// 		// sendATweet(status);
	// 		delete tweetsToSend[index];
	// 		console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
	// 	}
	// }, FIFTEEN_MINUTES);
})();
