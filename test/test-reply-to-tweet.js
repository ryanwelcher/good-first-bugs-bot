require('dotenv').config();

const TwitterPackage = require('twitter');

const mentions = require('./mocks/mentions.json');

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
mentions.forEach((mention) => {
	const {
		text,
		id_str: replyToTweet,
		user: { screen_name: username },
	} = mention;

	if (username === 'ryanwelcher' && text === '@GoodFirstBugs I need a ticket') {
		const handle = `@${username}`;
		const message = `Here you go ${handle}!`;
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
	}
});
