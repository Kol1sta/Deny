// Файл обрабатывает слеш-кооманды
import { Interaction } from "discord.js";
import { EventItem } from "../services/events";

import { Client, Collection } from 'discord.js';

interface ClientWithCommands extends Client {
    commands: Collection<string, any>;
}



export default new EventItem({
    isOnce: false,
    name: 'interactionCreate'
}, async (interaction: Interaction) => {
    
    if (!interaction.isChatInputCommand()) return;

    try {
        const client = interaction.client as ClientWithCommands;
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`Команда ${interaction.commandName} не найдена.`);
            return;
        }

        await command.execute(interaction);
    } catch (error) {
        console.error(`Ошибка выполнения команды ${interaction.commandName}:`, error);
        
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'Произошла ошибка при выполнении команды!',
                ephemeral: true
            });
        }
    }
});