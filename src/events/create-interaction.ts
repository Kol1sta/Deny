// МОЛЮ НЕ ТРОГАЙТЕ ЭТО 🙏🙏

import { Interaction, EmbedBuilder } from "discord.js";
import { EventItemOptions, EventItem } from "../services/events";

const options: EventItemOptions = {
    isOnce: false,
    name: 'interactionCreate'
}

export default new EventItem(options, async (interaction: Interaction) => {
    if(!interaction.isStringSelectMenu()) return;

    if(interaction.customId === "help-cmd") {
        const selectedCategory = interaction.values[0];

        switch (selectedCategory) {
            case 'info':
                const embed = new EmbedBuilder()
                    .setTitle("Информация")
                    .setDescription("Дескриптион")
                    .setColor(0xFFF4D8)

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            default:
                break;
        }
    }
});