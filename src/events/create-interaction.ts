// МОЛЮ НЕ ТРОГАЙТЕ ЭТО 🙏🙏

import { Interaction, EmbedBuilder } from "discord.js";
import { EventItemOptions, EventItem } from "../services/events";
import Client from "../services/client";

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
