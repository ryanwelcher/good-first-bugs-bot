"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Parser = require('rss-parser');
const coreUrl = 'http://core.trac.wordpress.org/ticket/';
const feed = 'https://core.trac.wordpress.org/query?status=accepted&status=assigned&status=new&status=reopened&status=reviewing&keywords=~good-first-bug+needs-patch&format=rss&order=id';
module.exports = function getTracTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parser = new Parser({
                headers: {
                    'User-Agent': 'good-first-bugs; https://github.com/ryanwelcher/good-first-bugs-bot',
                },
            });
            const response = yield parser.parseURL(feed);
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
        }
        catch (error) {
            return false;
        }
    });
};
