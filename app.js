/**
 * Created by ryanwelcher on 2017-04-07.
 */
require('dotenv').config();
const TwitterPackage = require( 'twitter' );

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const feed           = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcore.trac.wordpress.org%2Freport%2F44%3Fasc%3D1%26format%3Drss&api_key=' + process.env.RSS2JSON_KEY+'&count=200&order_by=pubDate';
let alreadyTweeted = [];
let preppedTweets  = [];
const banter         = [
	'Here\'s a good one!',
	'Matt thinks you should fix this.',
	'Practically giving Props away over here!',
	'Wanna contribute to #WordPress core? Start with this one.',
	'You could be a Rockstar!',
	'Help make the internet',
	'Easy Props!',
	'One of your old favourite songs from way back when',
	'While the band’s playin’',
	'Time to get started!',
	'No time like the present.',
	'Scotch is for shippers',
	'Capital P Dangit!',
];
const coreUrl 		 = 'https://core.trac.wordpress.org/ticket/';
let isTweeting = false;

function initGoodFirstBugsBot() {
	"use strict";
	TweetGoodFirstBugs();
}

function TweetGoodFirstBugs()  {
	"use strict";
	let request  = require('request'); // for fetching the feed
	console.log( 'Loading Feed ... ' );
	console.log('**********************');
	console.log( alreadyTweeted );
	console.log('**********************');
	request({
		url: feed,
		json: true
	}, function( error, response, body ) {
		if ( ! error && 200 === response.statusCode ) {
			let bugs           = body.items;
			let arrayIndex     = 0;
			let ticketsToTweet = {};

			// Get a list of all the bugs.
			bugs.forEach( function( i ) {
				ticketsToTweet[arrayIndex] = i.link.replace( coreUrl  , '' );
				arrayIndex++;
			});

			for ( let index in ticketsToTweet ) {
				let ticketNumber = ticketsToTweet[index];
				if ( ! alreadyTweeted.includes( ticketNumber ) ) {
					let message = banter[Math.floor(Math.random() * banter.length)];
					let tweet = message + ' ' + coreUrl + ticketNumber + ' #GoodFirstBug';
					preppedTweets.push( tweet );
					alreadyTweeted.push( ticketNumber );
				}
			}
			/**
			 * Delayed foreach function to not innundate twitter with tweets. No more 100 tweet dumps.
			 * Shamelessly stolen from a much smarter person than I - https://github.com/magnificode/thecongressbot/blob/master/bot.js#L74
			 * @param callback
			 * @param timeout
			 * @param thisArg
			 */
			Array.prototype.delayedForEach = function(callback, timeout, thisArg){
				var i = 0,
					l = this.length,
					self = this,

					caller = function(){
						callback.call(thisArg || self, self[i], i, self);
						(++i < l) && setTimeout(caller, timeout);
					};

				caller();
			};

			function staggerTweet() {
				// Tweet each tweet, waiting 15 minutes between each.
				preppedTweets.delayedForEach(function(tweet, index, array){
					//Report number of tweets in the pipeline.
					console.log( 'There are ' + preppedTweets.length + ' tweets queued.' );
					console.log('**********************');
					const toTweet = array[0];
					// If there's something to tweet.
					if ( toTweet !== undefined ) {
						Twitter.post('statuses/update', { status: toTweet }, function(err, data, response) {
							if( toTweet ) {
								console.log('Tweeted: ' + toTweet);
								console.log('**********************');
							}
							if( err ) {
								console.log(err);
							}
						});
					}
					preppedTweets.splice( 0,1 );
				}, 15*60*1000); //15 minutes
			}
			if ( false === isTweeting ) {
				staggerTweet();
				isTweeting = true;
			}

		} else {
			console.log( 'Feed request error:', error );
		}
	});
}
/**
 * Start the show.
 */
initGoodFirstBugsBot();
setInterval(TweetGoodFirstBugs, 60*60*1000);