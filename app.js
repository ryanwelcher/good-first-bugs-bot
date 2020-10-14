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

const { generateTweetStatus } = require('./src/utils/tweet-status');
const { selectTicket } = require('./src/utils/select-ticket');

const getTickets = require('./src/getTickets');
const sendATweet = require('./src/sendATweet');
const getLatestMentions = require('./src/getLatestMentions');

let firstRun = true;
let lastRespondedToTweet;
const HALF_HOUR = 30 * 60 * 1000;
const FIFTEEN_MINUTES = HALF_HOUR / 2;
const HOUR = HALF_HOUR * 2;
const { STARTING_TWEET } = process.env;

(async function () {
	let tweetsToSend = await getTickets();
	let mentions;
	if (firstRun) {
		mentions = await getLatestMentions(STARTING_TWEET);
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

	setInterval(async () => {
		mentions = await getLatestMentions(lastRespondedToTweet);
		mentions.forEach((mention) => {
			const {
				text,
				id_str: replyToTweet,
				user: { screen_name: username },
			} = mention;
			if (username !== 'ryanwelcher') {
				const handle = `@${username}`;
				const lowerCaseText = text.toLowerCase();
				if (lowerCaseText.includes('need a ticket')) {
					// Pick a random tweet
					const tweetKeys = Object.keys(tweetsToSend);
					if (tweetKeys.length !== 0) {
						const index = tweetKeys[Math.floor(Math.random() * tweetKeys.length)];
						const { issue, title, type, url } = tweetsToSend[index];
						const hashtags =
							type === 'gb' ? '#GoodFirstBug #Gutenberg' : '#GoodFirstBug #WordPress';
						const message = `Here you go ${handle}! #${issue}: ${title} ${url} ${hashtags}`;
						lastRespondedToTweet = replyToTweet;
						if (process.env.NODE_ENV === 'production') {
							Twitter.post(
								'statuses/update',
								{ status: message, in_reply_to_status_id: replyToTweet },
								function (err) {
									if (message) {
										console.log(`Responded: ${message}`);
									}
									if (err) {
										console.log(err);
									}
								},
							);
						} else {
							console.log(`Dev: Responded: ${message}`);
						}
					}
				}
			}
		});
	}, HOUR);
})();
