import { Message } from 'discord.js';
import { CommandItem } from '../services/commands';

export default new CommandItem({
    name: 'ping',
    desc: 'test cmd'
}, async (msg: Message) => {
    msg.reply('Pong!');
});