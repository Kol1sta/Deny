import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';

export default new CommandItem({ name: 'unban' }, async (msg: Message, args: string[]) => {
    if(!msg.guild) {
        await msg.reply('Эта команда работает только на серверах!');
        return;
    } else if(!msg.member?.permissions.has('BanMembers')) {
        await msg.reply('У вас нет прав для бана участников!');
        return;
    } else if(args.length === 0) {
        await msg.reply('Укажите айди пользователя');
        return;
    }

    const userId = args[0];

    if (!/^\d{17,19}$/.test(userId)) {
        await msg.reply('Неверный айди');
        return;
    }

    try {
        const bans = await msg.guild.bans.fetch();
        const bannedUser = bans.get(userId);

        if (!bannedUser) {
            await msg.reply('Пользователь с таким ID не найден в списке банов');
            return;
        }

        await msg.guild.bans.remove(userId, `Разбанен пользователем ${msg.author.tag}`);

        await msg.reply(`Пользователь **${bannedUser.user.tag}** успешно разбанен!`);

    } catch (error: any) {
        console.error(error);

        if (error.code === 10026) {
            await msg.reply('Пользователь с таким ID не найден в списке банов');
        } else {
            await msg.reply('Произошла ошибка при разбане');
        }
    }
});
