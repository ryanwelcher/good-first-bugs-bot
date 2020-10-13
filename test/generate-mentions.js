/**
 * Node dependencies
 */
const fs = require('fs');

/**
 * Internal dependencies
 */
const getLatestMentions = require('../src/getLatestMentions');

const { STARTING_TWEET } = process.env;

(async function () {
	const mentions = await getLatestMentions(STARTING_TWEET);
	console.log(mentions);
	fs.writeFile('./test/mocks/mentions.json', JSON.stringify(mentions), function (err) {
		if (err) return console.log(err);
		console.log('Mentions created');
		return true;
	});
})();
