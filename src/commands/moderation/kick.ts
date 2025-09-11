import { ChatInputCommandInteraction } from "discord.js";
import { CommandItem } from '../../services/commands';

export default new CommandItem({
    name: 'kick',
    desc: 'Кикни любого шалопая'
}, async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) {
        await interaction.reply('Эта команда доступна только на сервере');
        return;
    }

    // Получаем опции команды
    const userOption = interaction.options.getUser('пользователь', true);
    const reason = interaction.options.getString('причина') || 'Причина не указана';

    try {
        const targetMember = await interaction.guild.members.fetch(userOption.id);

        // Проверки
        if (!targetMember.kickable) {
            await interaction.reply('Невозможно кикнуть этого пользователя');
            return;
        }

        if (targetMember.id === interaction.user.id) {
            await interaction.reply('Дурак, нельзя кикнуть самого себя');
            return;
        }

        // Выполнение кика
        await targetMember.kick(reason);
        await interaction.reply(`Успешно кик пользователя ${targetMember.user.tag}`);
        
    } catch (error) {
        console.error(error);
        
        if ((error as any).code === 10007) { // Unknown Member
            await interaction.reply('Пользователь не найден на этом сервере');
        } else if ((error as any).code === 10013) { // Unknown User
            await interaction.reply('Пользователь с таким ID не существует');
        } else {
            await interaction.reply('Произошла ошибка при кике');
        }
    }
});