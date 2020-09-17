require('dotenv').config();

const TwitterPackage = require('twitter');

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
		delete tweetsToSend[index];
		console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
	}
};
