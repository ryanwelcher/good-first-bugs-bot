"use strict";
/**
 * Internal dependencies
 */
const { generateTweetStatus, getHashTags, hashTags } = require('./tweet-status');
describe('generateTweetStatus', () => {
    it('generates tweet message for Gutenberg ticket', () => {
        const ticket = {
            issue: '12345',
            title: 'Test GB Ticket',
            type: 'gb',
            url: 'https://www.example.com/test-ticket',
        };
        const hashtags = hashTags[ticket.type].join(' ');
        expect(generateTweetStatus(ticket)).toBe(`#${ticket.issue}: ${ticket.title} ${ticket.url} ${hashtags}`);
    });
    it('generates tweet message for trac ticket', () => {
        const ticket = {
            issue: '12345',
            title: 'Test WordPress trac ticket',
            type: 'trac',
            url: 'https://www.example.com/test-ticket',
        };
        const hashtags = hashTags[ticket.type].join(' ');
        expect(generateTweetStatus(ticket)).toBe(`#${ticket.issue}: ${ticket.title} ${ticket.url} ${hashtags}`);
    });
});
describe('getHashTags', () => {
    it('generates Gutenberg hash tags', () => {
        expect(getHashTags('gb')).toBe('#GoodFirstBug #Gutenberg');
    });
    it('generates WordPress trac hash tags', () => {
        expect(getHashTags('trac')).toBe('#GoodFirstBug #WordPress');
    });
});
