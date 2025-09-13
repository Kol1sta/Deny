import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';
import getActionFromTag from '../../utils/get-action';

export default new CommandItem({ name: 'wave' }, async (msg: Message) => {
    let user = msg.mentions.users.first();
    if(!user) { 
        await msg.reply({ content: 'Укажите пользователя!' }); 
        return;
    }

    await getActionFromTag({ 
        msg: msg, 
        tag: 'wave', 
        title: `Участник ${msg.author.displayName} помахал ${user?.username} рукой` 
    });
});