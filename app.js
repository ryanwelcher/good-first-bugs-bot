/**
 * Created by ryanwelcher on 2017-04-07.
 */

const getTickets = require('./src/getTickets');
const sendATweet = require('./src/sendATweet');

let firstRun = true;
const HALF_HOUR = 30 * 60 * 1000;
const FIFTEEN_MINUTES = HALF_HOUR / 2;

(async function () {
	let tweetsToSend = await getTickets();
	if (firstRun) {
		console.log('Auto tweeting on first run');
		sendATweet(tweetsToSend);
		firstRun = false;
	}
	setInterval(async () => {
		if (!Object.keys(tweetsToSend).length) {
			tweetsToSend = await getTickets();
		}
	}, HALF_HOUR);
	setInterval(() => {
		sendATweet(tweetsToSend);
	}, FIFTEEN_MINUTES);
})();
