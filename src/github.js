

const { Octokit } = require("@octokit/core")
const octokit = new Octokit();
module.exports = async function getGutenbergTickets() {
	try {
		const request = await octokit.request('GET /repos/{owner}/{repo}/issues', {
			owner: 'WordPress',
			repo: 'gutenberg',
			label: 'Good First Issue',
			state: 'open',
			per_page: 100
		});
		const { data } = request;
		const tickets = data.map( (ticket) => {
			const { html_url, title, number:issue } = ticket;
			return {
				type: 'gb',
				issue,
				url: html_url,
				title,
			}
		});
		return tickets;
	}catch( error ) {
		console.log( error  );
	}
}