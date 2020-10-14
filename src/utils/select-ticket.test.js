const { selectTicket } = require('./select-ticket');
const tickets = require('../../test/mocks/tickets.json');

describe('selectTickets', () => {
	it('selects a random ticket', () => {
		expect(selectTicket(tickets)).toEqual({
			ticket: expect.any(Object),
			index: expect.any(String),
		});
	});
	it('selects a specific index', () => {
		const { ticket, index } = selectTicket(tickets, 1);
		expect(ticket).toBe(tickets[1]);
		expect(index).toEqual(1);
	});
});
