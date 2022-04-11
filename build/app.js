/**
 * Created by ryanwelcher on 2017-04-07.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateTweetStatus } from './utils/tweet-status.js';
// const { generateTweetStatus } = require('./utils/tweet-status');
const { selectTicket } = require('./utils/select-ticket');
const getTickets = require('./getTickets');
const sendATweet = require('./sendATweet');
let firstRun = true;
const HALF_HOUR = 30 * 60 * 1000;
const FIFTEEN_MINUTES = HALF_HOUR / 2;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let tweetsToSend = yield getTickets();
        if (firstRun) {
            console.log('Auto tweeting on first run');
            const { ticket, index } = selectTicket(tweetsToSend);
            const status = generateTweetStatus(ticket);
            sendATweet(status);
            delete tweetsToSend[index];
            console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
            firstRun = false;
        }
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (!Object.keys(tweetsToSend).length) {
                tweetsToSend = yield getTickets();
            }
        }), HALF_HOUR);
        setInterval(() => {
            if (Object.keys(tweetsToSend).length) {
                const { ticket, index } = selectTicket(tweetsToSend);
                const status = generateTweetStatus(ticket);
                sendATweet(status);
                delete tweetsToSend[index];
                console.log(`There are ${Object.keys(tweetsToSend).length} tweets still in the queue`);
            }
        }, FIFTEEN_MINUTES);
    });
})();
