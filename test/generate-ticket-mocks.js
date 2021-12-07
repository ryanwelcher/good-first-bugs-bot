/**
 * Node dependencies
 */
const fs = require('fs');

/**
 * Internal dependencies
 */
const getGutenbergTickets = require('../src/github');
const getTracTickets = require('../src/trac');

(async function () {
	const [trac, gb] = await Promise.all([getTracTickets(), getGutenbergTickets()]);
	const tickets = [...trac, ...gb];
	fs.writeFile('./mock-tickets.json', JSON.stringify(tickets), function (err) {
		if (err) return console.log(err);
		console.log('Ticket mocks created');
		return true;
	});
})();
