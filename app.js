/**
 * Created by ryanwelcher on 2017-04-07.
 */
require('dotenv').config();
const rssUrlParser   = require("rss-url-parser");
const TwitterPackage = require( 'twitter' );

const Twitter = new TwitterPackage({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
const coreUrl      = 'https://core.trac.wordpress.org/ticket/';
const feed         = 'https://core.trac.wordpress.org/query?status=accepted&status=assigned&status=new&status=reopened&status=reviewing&keywords=~good-first-bug+needs-patch&format=rss&order=id';
let tweetsToSend   = {};
let tweetsSent     = [];
let firstRun       = true;


function getTickets() {
	rssUrlParser(feed)
		.then(function (data) {
			data.forEach(function (item) {
				let url    = item.link;
				let ticket = url.replace(coreUrl, '');
				let title  = item.title.replace('#' + ticket + ': ', '');
				if (! tweetsToSend.hasOwnProperty(ticket) && ! tweetsSent.includes( ticket ) ) {
					console.log( 'Adding ' + ticket + ' to queue' );
					tweetsToSend[ticket] = {
						'title': title,
						'url': url,
					};
				}
			});
			if ( firstRun ) {
				console.log( 'Auto tweeting on first run' );
				sendATweet();
				firstRun = false;
			}
			console.log( '************' );
		});
}

function sendATweet() {
	if ( Object.keys( tweetsToSend ).length !== 0 ) {
		console.log('Sending a tweet');
		let ticket = Object.keys(tweetsToSend)[0];
		let ticketData = tweetsToSend[ticket];
		let message = ticketData.title + ' ' + ticketData.url + ' #GoodFirstBug';
		if ( message.length > 140 ) {
			message = ticketData.title.substring( 0, 75 ) + '... ' + ticketData.url + ' #GoodFirstBug';
		}
		console.log( 'Tweeted: ' + message );
		Twitter.post('statuses/update', { status: message }, function(err, data, response ) {
			if( toTweet ) {
				console.log( 'Tweeted: ' + message );
				console.log( '**********************' );
			}
			if ( err ) {
				console.log(err);
			}
		});
		tweetsSent.push(ticket);
		delete tweetsToSend[ticket];
		console.log('There are ' + Object.keys(tweetsToSend).length + ' tweets still in the queue');
	}
}


// Start the show!
getTickets();
setInterval( getTickets, 30*60*1000 );
setInterval( sendATweet, 15*60*1000 );