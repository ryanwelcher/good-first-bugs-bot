"use strict";
/**
 * Node dependencies
 */
require('dotenv').config();
/** External dependencies */
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
 * @param {string } status The tweet status.
 * @param {args} [params]  Optional. Additional args to send to the Twitter API.
 */
module.exports = function sendATweet(status, params = {}) {
    if (process.env.NODE_ENV === 'production') {
        const apiArgs = Object.assign({ status }, params);
        Twitter.post('statuses/update', apiArgs, function (err) {
            if (status) {
                console.log(`Tweeted: ${status}`);
                console.log('**********************');
            }
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        console.log(`Dev: Tweeted: ${status}`);
    }
};
