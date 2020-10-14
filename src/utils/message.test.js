/**
 *
 */
const { generateMessage, generateHashTags, hashTags } = require('./messages');

describe('generateMessage', () => {
	it('generates tweet message for Gutenberg ticket', () => {
		const ticket = {
			issue: '12345',
			title: 'Test GB Ticket',
			type: 'gb',
			url: 'https://www.example.com/test-ticket',
		};
		const hashtags = hashTags[ticket.type].join(' ');
		expect(generateMessage(ticket)).toBe(
			`#${ticket.issue}: ${ticket.title} ${ticket.url} ${hashtags}`,
		);
	});
	it('generates tweet message for trac ticket', () => {
		const ticket = {
			issue: '12345',
			title: 'Test WordPress trac ticket',
			type: 'trac',
			url: 'https://www.example.com/test-ticket',
		};
		const hashtags = hashTags[ticket.type].join(' ');
		expect(generateMessage(ticket)).toBe(
			`#${ticket.issue}: ${ticket.title} ${ticket.url} ${hashtags}`,
		);
	});
});

describe('generateHashTags', () => {
	it('generates Gutenberg hash tags', () => {
		expect(generateHashTags('gb')).toBe('#GoodFirstBug #Gutenberg');
	});
	it('generates WordPress trac hash tags', () => {
		expect(generateHashTags('trac')).toBe('#GoodFirstBug #WordPress');
	});
});
