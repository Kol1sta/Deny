import { Message } from 'discord.js';

import { EventItem, EventItemOptions } from '../services/events';
import Client from '../services/client';

const options:EventItemOptions = {
    isOnce: false,
    name: 'messageCreate'
}

export default new EventItem(options, async (msg: Message, client: Client) => {
    if(msg.author.bot) return;

    const prefix: string = process.env.PREFIX as string;
    if(!msg.content.startsWith(prefix)) return;

    const args: Array<string> = msg.content.slice((prefix).length).trim().split(/ +/);
    const cname: string = <string>args.shift()?.toLowerCase();

    if(!cname || !client) return;
    else if(!client?.getCommandByName(cname)) return;

    const command = client?.getCommandByName(cname);

    try {
        await command.execute(msg, args, client);
    } catch(e) {
        console.log(e);
    }
});
