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
const { Octokit } = require('@octokit/core');
const octokit = new Octokit();
module.exports = function getGutenbergTickets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const request = yield octokit.request('GET /repos/{owner}/{repo}/issues', {
                owner: 'WordPress',
                repo: 'gutenberg',
                labels: 'Good First Issue',
                per_page: 100,
            });
            const { data } = request;
            const tickets = data.map((ticket) => {
                const { html_url, title, number: issue } = ticket;
                return {
                    type: 'gb',
                    issue,
                    url: html_url,
                    title,
                };
            });
            return tickets;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
};
