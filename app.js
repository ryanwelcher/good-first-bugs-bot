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
let alreadyTweeted = ['40363',
	'40354',
	'40353',
	'40342',
	'40286',
	'40244',
	'40188',
	'40130',
	'39970',
	'39955',
	'39922',
	'39759',
	'39671',
	'39667',
	'39633',
	'39459',
	'39419',
	'39320',
	'39213',
	'38953',
	'38918',
	'38828',
	'38686',
	'38653',
	'38369',
	'38367',
	'38310',
	'38268',
	'38258',
	'38238',
	'38197',
	'38085',
	'38073',
	'38017',
	'37873',
	'37826',
	'37799',
	'37752',
	'37595',
	'37528',
	'37451',
	'37430',
	'37422',
	'37280',
	'37013',
	'37004',
	'36905',
	'36827',
	'36346',
	'36263',
	'36259',
	'36163',
	'36159',
	'36036',
	'35778',
	'35776',
	'35567',
	'35465',
	'35188',
	'35166',
	'34881',
	'34726',
	'34413',
	'33756',
	'33591',
	'33387',
	'32939',
	'32816',
	'32544',
	'32322',
	'32228',
	'31977',
	'31779',
	'31502',
	'31029',
	'30829',
	'30439',
	'30240',
	'30154',
	'29785',
	'28956',
	'28620',
	'28569',
	'28033',
	'27888',
	'27770',
	'27671',
	'26268',
	'23749',
	'22101',
	'21941',
	'20537',
	'19826',
	'19709',
	'19556',
	'19288',
	'19272',
	'18603',
	'18035',
	'17851',];
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

function initGoodFirstBugsBot() {
	"use strict";
	TweetGoodFirstBugs();
}

function TweetGoodFirstBugs()  {
	"use strict";
	let request  = require('request'); // for fetching the feed
	console.log( 'Loading Feed ... ' );
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
			staggerTweet();
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