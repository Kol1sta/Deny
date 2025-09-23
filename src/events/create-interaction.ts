// МОЛЮ НЕ ТРОГАЙТЕ ЭТО 🙏🙏

import { Interaction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, ChannelType, ButtonBuilder } from "discord.js";
import { EventItemOptions, EventItem } from "../services/events";
import Client from "../services/client";
import { MUTE_ROLE_ID, OWNER_ID, STAFF_CHANNEL_ID, ADMIN_ROLE_ID, MOD_ROLE_ID, BOT_ID, OWNER_ROLE_ID } from "../../config.json";

const options: EventItemOptions = {
    isOnce: false,
    name: 'interactionCreate'
}

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
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        if(interaction.customId === "staff-form") {
            if(member?.isCommunicationDisabled() || member?.roles.cache.find(role => role.id == MUTE_ROLE_ID)) {
                await interaction.reply({ ephemeral: true, content: "Не удалось отправить заявку" });
                return;
            }

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
        } else if(interaction.customId === "ticket-open") {
            if(member?.isCommunicationDisabled() || member?.roles.cache.find(role => role.id == MUTE_ROLE_ID)) {
                await interaction.reply({ ephemeral: true, content: "Не удалось открыть тикет" });
                return;
            }

            const channel = await interaction.guild?.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                    },
                    {
                        id: ADMIN_ROLE_ID,
                        allow: ['ViewChannel', 'SendMessages', 'ManageMessages', 'ManageChannels'],
                    },
                    {
                        id: MOD_ROLE_ID,
                        allow: ['ViewChannel', 'SendMessages', 'ManageMessages'],
                    },
                    {
                        id: client.user?.id || BOT_ID,
                        allow: ['ViewChannel', 'SendMessages', 'ManageMessages', 'ManageChannels'],
                    }
                ],
            });

            if(!channel) {
                await interaction.reply({ ephemeral: true, content: "Ошибка при создании канала" });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle("Новый тикет")
                .setDescription(`Опишите свою проблему и ожидайте ответ от свободных участников администрации! Учтите, что если ваш вопрос не связан напрямую с администрацией проекта, вы можете попробовать его задать в форуме публичных вопросов или идей, где вам смогут ответить обычные участники`)
                .setFooter({ text: `Создано ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || undefined })
                .setTimestamp()
                .setThumbnail(interaction.user.avatarURL())
                .setColor(0xFFF4D8)

            const closeButton = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ticket-close")
                        .setLabel("Закрыть тикет")
                        .setStyle(2)
                        .setEmoji("❌")
                )

            await channel.send({ content: `||<@${interaction.user.id}><@&1410395253369737296><@&1410395281534750720>||`, embeds: [embed], components: [closeButton] });
            await interaction.reply({ ephemeral: true, content: `Тикет успешно создан: ${channel}` });
        } else if(interaction.customId === "ticket-close") {
            try {
                if (!interaction.channel || !interaction.channel.isTextBased() || interaction.channel.isDMBased()) {
                    await interaction.reply({ content: "Эта команда работает только в каналах", ephemeral: true });
                    return;
                }

                const guildChannel = interaction.channel as any;

                const isTicketOwner = guildChannel.name?.includes(interaction.user.username);
                const hasStaffRole = member?.roles.cache.some(role =>
                    role.id === OWNER_ROLE_ID ||
                    role.id === ADMIN_ROLE_ID ||
                    role.id === MOD_ROLE_ID
                );

                if (!isTicketOwner && !hasStaffRole) {
                    await interaction.reply({
                        content: "У вас недостаточно прав для закрытия этого тикета",
                        ephemeral: true
                    });
                    return;
                }

                const closeEmbed = new EmbedBuilder()
                    .setTitle("Тикет закрыт")
                    .setDescription(`Тикет закрыт пользователем ${interaction.user.tag}`)
                    .addFields(
                        { name: "Закрыт", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                        { name: "Пользователь", value: `${interaction.user}`, inline: true }
                    )
                    .setColor(0xFFF4D8)
                    .setTimestamp()
                    .setFooter({ text: `Запрошено ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || undefined })

                const disabledButton = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ticket-close")
                            .setLabel("Тикет закрыт")
                            .setStyle(2)
                            .setDisabled(true)
                            .setEmoji("🔒")
                    );

                await interaction.reply({
                    embeds: [closeEmbed],
                    components: [disabledButton]
                });

                await guildChannel.permissionOverwrites.edit(interaction.guild!.id, {
                    ViewChannel: false,
                    SendMessages: false
                });

                const channelMembers = guildChannel.members?.map((member: any) => member.id) || [];

                for (const memberId of channelMembers) {
                    const member = await interaction.guild?.members.fetch(memberId).catch(() => null);
                    if (member) {
                        const isStaff = member.roles.cache.some(role =>
                            role.id === OWNER_ROLE_ID ||
                            role.id === ADMIN_ROLE_ID ||
                            role.id === MOD_ROLE_ID
                        );

                        if (!isStaff) {
                            await guildChannel.permissionOverwrites.edit(memberId, {
                                ViewChannel: false,
                                SendMessages: false
                            });
                        }
                    }
                }

                await guildChannel.permissionOverwrites.edit(interaction.guild!.id, {
                    ViewChannel: false
                });

                await guildChannel.permissionOverwrites.edit(ADMIN_ROLE_ID, {
                    ViewChannel: true,
                    SendMessages: true,
                    ManageMessages: true
                });

                await guildChannel.permissionOverwrites.edit(MOD_ROLE_ID, {
                    ViewChannel: true,
                    SendMessages: true,
                    ManageMessages: true
                });

                await guildChannel.permissionOverwrites.edit(client.user!.id, {
                    ViewChannel: true,
                    SendMessages: true,
                    ManageMessages: true,
                    ManageChannels: true
                });

                await guildChannel.setName(`closed-${guildChannel.name}`);
            } catch (error) {
                console.error('Ошибка при закрытии тикета: ', error);
                await interaction.reply({
                    content: "Ошибка при закрытии тикета",
                    ephemeral: true
                });
            }
        }
    }

    if(interaction.type === InteractionType.ModalSubmit) {
        if(interaction.customId === "staff-form-modal") {
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

    async function newFunction(guildChannel: any) {
        const ticketCreatorUsername = guildChannel.name.replace('ticket-', '').replace('closed-', '');
        const members = await interaction.guild?.members.fetch();
        const ticketCreator = members?.find(member => member.user.username === ticketCreatorUsername
        );
        return ticketCreator;
    }
});
