import { Message, EmbedBuilder } from "discord.js";
import { CommandItem } from "../services/commands";

export default new CommandItem({ name: 'user' }, async (msg: Message) => {
    let user = msg.mentions.users.first();
    if(!user) user = msg.author;

    const member = await msg.guild?.members.fetch(msg.author.id);

    const embed = new EmbedBuilder()
        .setTitle(`Пользователь ${user.displayName}`)
        .setDescription(`\`Имя пользователя\`: ${user.tag}
\`Айди\`: ${member?.id}
\`Статус\`: ${member?.presence?.status || 'offline'}
\`Репутация\`: 0`)
        .setColor(0xFFF4D8)
        .setThumbnail(user.avatarURL() || null)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()

    await msg.reply({ embeds: [embed] });
});