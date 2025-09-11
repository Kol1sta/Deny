import { Message, EmbedBuilder } from 'discord.js';
import { CommandItem } from '../services/commands';

export default new CommandItem({ name: 'avatar' }, async (msg: Message) => {
    let user = msg.mentions.users.first();
    if(!user) user = msg.author;
    
    const embed = new EmbedBuilder()
        .setTitle(`Аватар ${user.displayName}`)
        .setImage(user.avatarURL({ size: 2048 }))
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()
    
    await msg.reply({ embeds: [embed] });
});