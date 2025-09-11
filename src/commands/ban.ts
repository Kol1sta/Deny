import { Message } from 'discord.js';
import { CommandItem } from '../services/commands';

export default new CommandItem({
    name: 'ban',
    desc: 'Банит указанного участника по id или @user',
}, async (msg: Message) => {
    if (!msg.guild) {
        await msg.reply('Эта команда работает только на серверах!');
        return;
    }
    
    if (!msg.member?.permissions.has('BanMembers')) {
        await msg.reply('У вас нет прав для бана участников!');
        return;
    }

    const args = msg.content.split(' ').slice(1);
    const target = msg.mentions.members?.first() || msg.guild.members.cache.get(args[0]);
    let reason = args.slice(1).join(' ') || 'Причина не указана';

    if (!target) {
        await msg.reply('Укажите участника для бана!');
        return;
    }
    
    if (target.id === msg.author.id) {
        await msg.reply({ content: 'Вы не можете забанить себя!' });
        return;
    }
    
    if (!target.bannable || msg.member.roles.highest.position <= target.roles.highest.position) {
        await msg.reply('Невозможно забанить этого участника!');
        return;
    }

    try {
        await target.ban({ reason });
        await msg.reply(`Участник ${target.user.tag} был забанен! Причина: ${reason}`);
    } catch (error) {
        console.error(error);
        await msg.reply('Произошла ошибка при бане участника!');
    }
});