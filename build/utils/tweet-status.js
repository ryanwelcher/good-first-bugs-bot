/**
 * Our hash tags.
 */
const hashTags = {
    gb: ['#GoodFirstBug', '#Gutenberg'],
    trac: ['#GoodFirstBug', '#WordPress'],
};
/**
 * Gets the list of hash tags for the type of ticket
 *
 * @param ticketType The type of ticket
 *
 * @returns {string} The concatenated list of hashtags.
 */
export function getHashTags(ticketType) {
    return hashTags[ticketType].join(' ');
}
/**
 * Generate the tweet content.
 *
 * If the message is over 140 characters, the title is truncated.
 *
 * @param {Ticket} ticket        The ticket object.
 * @param {string} [baseMessage] Optional. The base message to prepend to the generated message
 *
 * @returns {string} The message for the tweet.
 */
export function generateTweetStatus(ticket, baseMessage = '') {
    const { issue, title, type, url } = ticket;
    const hashtags = getHashTags(type);
    let message = `${baseMessage}#${issue}: ${title} ${url} ${hashtags}`;
    if (message.length > 140) {
        message = `#${issue}: ${title.substring(0, 75)}... ${url} ${hashtags}`;
    }
    return message;
}
