/**
 * Node dependencies
 */
require('dotenv').config();

/** External dependencies */
const TwitterPackage = require('twitter');

/**
 * Internal dependencies
 */
const { generateTweetStatus } = require('./utils/tweet-status');

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

/**
 * Tweet!
 *
 * @param {Array} tweetsToSend Array of queued items.
 */
module.exports = function sendATweet(tweetsToSend) {
	const tweetKeys = Object.keys(tweetsToSend);
	if (tweetKeys.length !== 0) {
		const index = tweetKeys[Math.floor(Math.random() * tweetKeys.length)];
		const content = generateTweetStatus(tweetsToSend[index]);
		if (process.env.NODE_ENV === 'production') {
			Twitter.post('statuses/update', { status: content }, function (err) {
				if (content) {
					console.log(`Tweeted: ${content}`);
					console.log('**********************');
				}
				if (err) {
					console.log(err);
				}
			});
		} else {
			console.log(`Dev: Tweeted: ${content}`);
		}

		delete tweetsToSend[index];
		console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
	}
};
