/**
 * Created by ryanwelcher on 2017-04-07.
 */
require('dotenv').config();

const TwitterPackage = require('twitter');

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const tweetsToSend = {};
const tweetsSent = [];
let firstRun = true;

const getGutenbergTickets = require('./src/github');
const getTracTickets = require('./src/trac');

async function getTickets() {
	const [trac, gb] = await Promise.all([getTracTickets(), getGutenbergTickets()]);
	const tickets = [...trac, ...gb];
	tickets.forEach((ticket) => {
		const { issue, url, title, type } = ticket;
		if (!tweetsToSend.hasOwnProperty(ticket) && !tweetsSent.includes(ticket)) {
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
		sendATweet();
		firstRun = false;
	}
}

function sendATweet() {
	const tweetKeys = Object.keys(tweetsToSend);
	if (tweetKeys.length !== 0) {
		console.log('Sending a tweet');
		const index = tweetKeys[Math.floor(Math.random() * tweetKeys.length)];
		const { issue, title, type, url } = tweetsToSend[index];
		const hashtags = type === 'gb' ? '#GoodFirstBug #Gutenberg' : '#GoodFirstBug #WordPress';
		let message = `#${issue}: ${title} ${url} ${hashtags}`;
		if (message.length > 140) {
			message = `#${issue}: ${title.substring(0, 75)}... ${url} ${hashtags}`;
		}
		console.log(`Tweeted: ${message}`);
		Twitter.post('statuses/update', { status: message }, function (err, data, response) {
			if (message) {
				console.log(`Tweeted: ${message}`);
				console.log('**********************');
			}
			if (err) {
				console.log(err);
			}
		});
		tweetsSent.push(index);
		delete tweetsToSend[index];
		console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
	}
}
// Start the show!
getTickets();
setInterval(getTickets, 30 * 60 * 1000);
setInterval(sendATweet, 15 * 60 * 1000);
