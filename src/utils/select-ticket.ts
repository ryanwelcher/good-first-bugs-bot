import { Ticket } from './tweet-status';

/**
 * Retrieve a ticket from the given list.
 *
 * @param {Array} availableTickets Array of available tickets.
 * @param {number} [index]         Optional. Specific index in the array of tickets to return.
 *
 * @returns {object} The selected ticket
 */
export function selectTicket(availableTickets: Array<Ticket>, index?: number): Object {
	const ticketKeys = Object.keys(availableTickets);
	const selectedIndex = index || ticketKeys[Math.floor(Math.random() * ticketKeys.length)];
	return {
		ticket: availableTickets[Number(selectedIndex)],
		index: selectedIndex,
	};
}
