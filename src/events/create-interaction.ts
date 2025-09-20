// МОЛЮ НЕ ТРОГАЙТЕ ЭТО 🙏🙏

import { Interaction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType } from "discord.js";
import { EventItemOptions, EventItem } from "../services/events";
import Client from "../services/client";
import { MUTE_ROLE_ID, OWNER_ID, STAFF_CHANNEL_ID } from "../../config.json";

const options: EventItemOptions = {
    isOnce: false,
    name: 'interactionCreate'
}

// @ts-ignore
export default new EventItem(options, async (interaction: Interaction, client: Client) => {
    // if(interaction.isChatInputCommand()) {
    //     const command = client.getCommandByName(interaction.commandName);

    //     if(!command) {
    //         await interaction.reply("Command handler not found");
    //         return;
    //     }

    //     try {
    //         await command.execute(interaction);
    //     } catch(e) {
    //         await interaction.reply("Error at server side");
    //         console.log(e);
    //         return;
    //     }
    // }

    if(interaction.isButton()) {
        if(interaction.customId === "staff-form") {
            const modalWindow = new ModalBuilder()
                .setCustomId("staff-form-modal")
                .setTitle("Анкета")

            const roleInput = new TextInputBuilder()
                .setCustomId("staff-role")
                .setLabel("На кого вы хотите подать?")
                .setPlaceholder("Хелпер/Пиар Менеджер")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const experienceInput = new TextInputBuilder()
                .setCustomId("staff-experience")
                .setLabel("Ваш опыт на этой роли")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const characterInput = new TextInputBuilder()
                .setCustomId("staff-character")
                .setLabel("Опишите себя")
                .setPlaceholder("В основном характер, буквально пара предложений")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionRow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(roleInput);
            const actionRow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(experienceInput);
            const actionRow3 = new ActionRowBuilder<TextInputBuilder>().addComponents(characterInput);

            modalWindow.addComponents(actionRow1, actionRow2, actionRow3);

            await interaction.showModal(modalWindow);
        }
    }

    if(interaction.type === InteractionType.ModalSubmit) {
        if(interaction.customId === "staff-form-modal") {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            if(member?.isCommunicationDisabled() || member?.roles.cache.find(role => role.id == MUTE_ROLE_ID)) {
                await interaction.reply({ ephemeral: true, content: "Не удалось отправить заявку" });
                return;
            }

            await interaction.deferReply({ ephemeral: true });

            const role = interaction.fields.getTextInputValue('staff-role');
            const experience = interaction.fields.getTextInputValue('staff-experience');
            const character = interaction.fields.getTextInputValue('staff-character');

            const channel = interaction.guild?.channels.cache.find(ch => ch.id === STAFF_CHANNEL_ID && ch.isTextBased());

            if(channel && channel.isTextBased()) {
                const embed = new EmbedBuilder()
                    .setTitle("Новая заявка ₊˚✦                                       ₊")
                    .setDescription(`🌺﹕**Роль**﹔₊˚✦
\`\`\`
${role}
\`\`\`

💮﹕**Опыт**﹔₊˚✦:
\`\`\`
${experience}
\`\`\`

🍵﹕**О себе**﹔₊˚✦
\`\`\`
${character}
\`\`\`
`)
                    .setFooter({ text: `Отправлено ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || undefined })
                    .setTimestamp()
                    .setThumbnail(interaction.user.avatarURL())
                    .setColor(0xFFF4D8)

                await channel.send({ content: `||<@${OWNER_ID}>||`, embeds: [embed] });
            }

            interaction.editReply({ content: "Заявка отправлена!" });
        }
    }

    if(!interaction.isStringSelectMenu()) return;

    if(interaction.customId === "help-cmd") {
        const selectedCategory = interaction.values[0];

        switch (selectedCategory) {
            case 'info':
                const embed = new EmbedBuilder()
                    .setTitle("**🌺 Информация**")
                    .setDescription(`\`${process.env.PREFIX}help\`: отправляет список всех команд бота
\`${process.env.PREFIX}server\`: отправляет информацию о сервере
\`${process.env.PREFIX}user\`: отправляет информацию о пользователе`)
                    .setColor(0xFFF4D8)

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            case 'mod':
                const embed2 = new EmbedBuilder()
                    .setTitle("**💮 Модерация**")
                    .setDescription(`\`${process.env.PREFIX}ban\`: блокирует участника на сервере
\`${process.env.PREFIX}kick\`: удаляет участника с сервера
\`${process.env.PREFIX}unban\`: разбанивает участника по айди
\`${process.env.PREFIX}clear\`: удаляет множество сообщений`)
                    .setColor(0xFFF4D8)

                await interaction.reply({ embeds: [embed2], ephemeral: true });
                break;
            case 'actions':
                const embed3 = new EmbedBuilder()
                    .setTitle("**🥝 Взаимодействия**")
                    .setDescription(`\`${process.env.PREFIX}punch\`: ударить участника
\`${process.env.PREFIX}hug\`: обнять участника
\`${process.env.PREFIX}kiss\`: поцеловать участника
\`${process.env.PREFIX}cry\`: заплакать
\`${process.env.PREFIX}lick\`: облизать участника
\`${process.env.PREFIX}wave\`: помахать участнику`)
                    .setColor(0xFFF4D8)

                await interaction.reply({ embeds: [embed3], ephemeral: true });
                break;
            case 'utils':
                const embed4 = new EmbedBuilder()
                    .setTitle("**🍵 Утилиты**")
                    .setDescription(`\`${process.env.PREFIX}avatar\`: отправляет аватар участника
\`${process.env.PREFIX}rand\`: отправляет случайное число в диапозоне
\`${process.env.PREFIX}calc\`: маленький калькулятор на четыре операции`)
                    .setColor(0xFFF4D8)

                await interaction.reply({ embeds: [embed4], ephemeral: true });
                break;
            default:
                break;
        }
    }
});
