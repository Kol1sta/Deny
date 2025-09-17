// q.clear X

import { Message, ChannelType } from 'discord.js';
import { CommandItem } from '../../services/commands';

export default new CommandItem({
    name: 'clear',
    desc: 'Очищает указанное количество сообщений',
}, async (msg: Message, args: string[]) => {
    if (!msg.guild) {
        await msg.reply('Эта команда работает только на серверах!');
        return;
    } else if (msg.channel.type !== ChannelType.GuildText) {
        await msg.reply('Эта команда работает только в текстовых каналах сервера!');
        return;
    } else if (!msg.member?.permissions.has('ManageMessages')) {
        await msg.reply('У вас нет прав!');
        return;
    } else if (args.length === 0) {
        await msg.reply('Укажите количество сообщений для очистки!');
        return;
    }

    const amount = parseInt(args[0]);

    // Проверяем, указано ли количество и является ли оно числом
    if (isNaN(amount) || amount < 1 || amount > 100) {
        await msg.reply('Укажите корректное количество сообщений (от 1 до 100)!');
        return;
    }

    try {
        // Получаем сообщения для удаления (включая исходное сообщение)
        const messages = await msg.channel.messages.fetch({ limit: amount + 1 });

        // Фильтруем сообщения, которые можно удалить (не старше 14 дней)
        // Исключаем исходное сообщение команды из удаления
        const deletableMessages = messages.filter(message => {
            return message.id !== msg.id && // Не удаляем само сообщение с командой
                   Date.now() - message.createdTimestamp < 1209600000; // 14 дней в миллисекундах
        });

        let deletedCount = 0;

        // Удаляем сообщения
        if (deletableMessages.size > 0) {
            await msg.channel.bulkDelete(deletableMessages);
            deletedCount = deletableMessages.size;
        }

        const reply = await msg.reply(`Удалено ${deletedCount} сообщений!`);

        // Удаляем сообщение с ответом через 5 секунд
        setTimeout(async () => {
            try {
                await reply.delete();
            } catch (error) {
                console.error('Ошибка при удалении сообщения:', error);
            }
        }, 5000);

    } catch (error) {
        console.error('Ошибка при очистке сообщений:', error);
        await msg.reply('Произошла ошибка при очистке сообщений!');
    }
});
