import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';
import getActionFromTag from '../../utils/get-action';

export default new CommandItem({ name: 'cry' }, async (msg: Message) => {
    await getActionFromTag({
        msg: msg,
        tag: 'cry',
        title: `Участник ${msg.author.displayName} плачет`
    });
});
