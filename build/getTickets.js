var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getGutenbergTickets = require('./github');
const getTracTickets = require('./trac');
const mockTickets = require('../test/mock-tickets.json');
export default function getTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        const tweetsToSend = {};
        let tickets;
        if (process.env.NODE_ENV === 'production') {
            const [trac, gb] = yield Promise.all([getTracTickets(), getGutenbergTickets()]);
            tickets = [...trac, ...gb];
        }
        else {
            tickets = mockTickets;
        }
        const tweetKeys = Object.keys(tweetsToSend);
        tickets.forEach((ticket) => {
            const { issue, url, title, type } = ticket;
            if (!tweetKeys.some((key) => key === type + issue)) {
                tweetsToSend[type + issue] = {
                    type,
                    issue,
                    title,
                    url,
                };
            }
        });
        return tweetsToSend;
    });
}
