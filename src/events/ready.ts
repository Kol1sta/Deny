import { ActivityType } from 'discord.js';

import { EventItem, EventItemOptions } from '../services/events';
import Client from '../services/client';

const options:EventItemOptions = {
    isOnce: true,
    name: 'ready'
}

export default new EventItem(options, (client: Client) => {
    console.log(`Bot was started at ${client.user?.tag}`);
    client.user?.setPresence({ status: "idle" });
    client.user?.setActivity(`${process.env.PREFIX}help`, { type: ActivityType.Listening });
});
