import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';

export default new CommandItem({
    name: 'kick',
    desc: 'Кикает указанного участника по id или @user',
}, async (msg: Message, args: string[]) => {
    if (!msg.guild) {
        await msg.reply('Эта команда работает только на серверах!');
        return;
    } else if (!msg.member?.permissions.has('KickMembers')) {
        await msg.reply('У вас нет прав для кика участников!');
        return;
    }

    const target = msg.mentions.members?.first() || msg.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(' ') || 'Причина не указана';

    if (!target) {
        await msg.reply('Укажите участника для кика!');
        return;
    } else if (target.id === msg.author.id) {
        await msg.reply({ content: 'Вы не можете кикнуть себя!', });
        return;
    } else if (!target.kickable || msg.member.roles.highest.position <= target.roles.highest.position) {
        await msg.reply('Невозможно кикнуть этого участника!');
        return;
    }

    try {
        await target.kick(reason);
        await msg.reply(`Участник ${target.user.tag} был кикнут! Причина: ${reason}`);
    } catch (error) {
        console.error(error);
        await msg.reply('Произошла ошибка при кике участника!');
    }
});