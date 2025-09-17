import { Message, CommandInteraction } from 'discord.js';
import { CommandItem } from '../../services/commands';

export default new CommandItem({ name: 'ping' }, async (msg: Message | CommandInteraction) => {
    msg.reply('Pong!');
});
