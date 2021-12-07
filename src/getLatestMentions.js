require('dotenv').config();

const TwitterPackage = require('twitter');

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = async function getLatestMentions(lastTweetId = undefined) {
	const tweets = await Twitter.get('statuses/mentions_timeline', {
		count: 10,
		since_id: lastTweetId,
	});
	return tweets;
};
