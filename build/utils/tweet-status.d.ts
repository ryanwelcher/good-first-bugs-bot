declare type TicketType = 'gb' | 'trac';
export declare type Ticket = {
    issue: string;
    title: string;
    type: TicketType;
    url: string;
};
/**
 * Gets the list of hash tags for the type of ticket
 *
 * @param ticketType The type of ticket
 *
 * @returns {string} The concatenated list of hashtags.
 */
export declare function getHashTags(ticketType: TicketType): string;
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
export declare function generateTweetStatus(ticket: Ticket, baseMessage?: string): string;
export {};
