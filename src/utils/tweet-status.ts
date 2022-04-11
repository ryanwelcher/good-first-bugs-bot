/**
 * Our hash tags.
 */
const hashTags = {
	gb: ['#GoodFirstBug', '#Gutenberg'],
	trac: ['#GoodFirstBug', '#WordPress'],
};

type TicketType = 'gb' | 'trac';
/**
 * Gets the list of hash tags for the type of ticket
 *
 * @param ticketType
 */
function getHashTags(ticketType: TicketType) {
	return hashTags[ticketType].join(' ');
}

export type Ticket = {
	[k: string]: string;
};
/**
 * Generate the tweet content.
 *
 * If the message is over 140 characters, the title is truncated.
 *
 * @param {object} ticket        The ticket object.
 * @param {string} ticket.issue  The issue number for the ticket.
 * @param {string} ticket.title  The title of the ticket returned from the API
 * @param {string} ticket.type   Type of ticket. Either `gb` or `trac`
 * @param {string} ticket.url    The URL of the ticket.
 * @param {string} [baseMessage] Optional. The base message to prepend to the generated message
 * @returns {string} The message for the tweet.
 */
function generateTweetStatus(ticket: Ticket, baseMessage: string = '') {
	const { issue, title, type, url } = ticket;
	const hashtags = getHashTags(type);
	let message = `${baseMessage}#${issue}: ${title} ${url} ${hashtags}`;
	if (message.length > 140) {
		message = `#${issue}: ${title.substring(0, 75)}... ${url} ${hashtags}`;
	}
	return message;
}

module.exports = {
	getHashTags,
	generateTweetStatus,
	hashTags,
};
