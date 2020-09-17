const Parser = require('rss-parser');

const coreUrl = 'http://core.trac.wordpress.org/ticket/';
const feed =
	'https://core.trac.wordpress.org/query?status=accepted&status=assigned&status=new&status=reopened&status=reviewing&keywords=~good-first-bug+needs-patch&format=rss&order=id';

module.exports = async function getTracTickets() {
	try {
		const parser = new Parser({
			headers: {
				'User-Agent': 'good-first-bugs; https://github.com/ryanwelcher/good-first-bugs-bot',
			},
		});
		const response = await parser.parseURL(feed);
		const { items } = response;
		const tickets = items.map((ticket) => {
			const { link: url, title } = ticket;
			const issue = url.replace(coreUrl, '');
			return {
				type: 'trac',
				issue,
				url,
				title: title.replace(`#${issue}: `, ''),
			};
		});
		return tickets;
	} catch (error) {
		return false;
	}
};
