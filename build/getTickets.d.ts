import { Ticket } from './utils/tweet-status';
declare type TweetList = {
    [key: string]: Ticket;
};
export default function getTickets(): Promise<TweetList>;
export {};
