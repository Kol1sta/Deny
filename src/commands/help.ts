import { Message, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { CommandItem } from "../services/commands";

export default new CommandItem({ name: 'help' }, async (msg: Message) => {
    const embed = new EmbedBuilder()
        .setTitle("Команды")
        .setDescription(`Список всех доступных команд в боте. Для вызова используется префикс ${process.env.PREFIX}`)
        .setColor(0xFFF4D8)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })

    const menu = new StringSelectMenuBuilder()
        .setCustomId("help-cmd")
        .setPlaceholder("Категории")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Информация")
                .setDescription('Информационные команды')
                .setValue("info"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Модерация")
                .setDescription('Команды для модерирования')
                .setValue("actions"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Взаимодействия")
                .setDescription('Различные весёлости')
                .setValue("actions"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Утилиты")
                .setDescription('Серверные утилиты')
                .setValue("actions")
        );

    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    await msg.reply({ embeds: [embed], components: [row1] });
});