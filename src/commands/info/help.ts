import { Message, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { CommandItem } from "../../services/commands";
import Client from "../../services/client";

// @ts-ignore
export default new CommandItem({ name: 'help' }, async (msg: Message, args, client: Client) => {
    const embed = new EmbedBuilder()
        .setTitle("Команды")
        .setDescription(`Список всех доступных команд в боте. Для вызова используется префикс ${process.env.PREFIX}

🌺﹕**Информация**﹔₊˚✦
\`${process.env.PREFIX}help\`, \`${process.env.PREFIX}server\`, \`${process.env.PREFIX}user\`

💮﹕**Модерация**﹔₊˚✦
\`${process.env.PREFIX}ban\`, \`${process.env.PREFIX}kick\`, \`${process.env.PREFIX}unban\`, \`${process.env.PREFIX}clear\`

🥝﹕**Взаимодействия**﹔₊˚✦
\`${process.env.PREFIX}punch\`, \`${process.env.PREFIX}hug\`, \`${process.env.PREFIX}kiss\`, \`${process.env.PREFIX}cry\`, \`${process.env.PREFIX}lick\`, \`${process.env.PREFIX}wave\`

🍵﹕**Утилиты**﹔₊˚✦
\`${process.env.PREFIX}avatar\`, \`${process.env.PREFIX}rand\`, \`${process.env.PREFIX}calc\``)
        .setColor(0xFFF4D8)
        .setThumbnail(client.user?.avatarURL() || null)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()

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
                .setValue("mod"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Взаимодействия")
                .setDescription('Различные весёлости')
                .setValue("actions"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Утилиты")
                .setDescription('Серверные утилиты')
                .setValue("utils")
        );

    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);

    await msg.reply({ embeds: [embed], components: [row1] });
});