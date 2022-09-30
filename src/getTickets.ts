import { Ticket } from './utils/tweet-status';

const getGutenbergTickets = require('./github');
const getTracTickets = require('./trac');
const mockTickets = require('../test/mock-tickets.json');

type TweetList = {
	[key: string]: Ticket;
};

export default async function getTickets(): Promise<TweetList> {
	const tweetsToSend: TweetList = {};
	let tickets;
	if (process.env.NODE_ENV === 'production') {
		const [trac, gb] = await Promise.all([getTracTickets(), getGutenbergTickets()]);
		tickets = [...trac, ...gb];
	} else {
		tickets = mockTickets;
	}

	const tweetKeys = Object.keys(tweetsToSend);
	tickets.forEach((ticket: Ticket) => {
		const { issue, url, title, type } = ticket;
		if (!tweetKeys.some((key) => key === type + issue)) {
			tweetsToSend[type + issue] = {
				type,
				issue,
				title,
				url,
			};
		}
	});
	return tweetsToSend;
}
