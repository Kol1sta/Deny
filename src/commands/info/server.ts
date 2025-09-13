import { Message, EmbedBuilder } from "discord.js";
import { CommandItem } from "../../services/commands";

export default new CommandItem({ name: 'server' }, async (msg: Message) => {
    const server = msg.guild;
    const owner = await server?.fetchOwner();

    const embed = new EmbedBuilder()
        .setTitle(`Сервер ${server?.name}`)
        .setDescription(`🌺 Участники: \`${server?.memberCount}\`
💮 Ролей: \`${server?.roles.cache.size}\`
🥝 Каналов: \`${server?.channels.cache.size}\`

🍵 Владелец: \`${owner?.user.tag}\`
🍥 ID сервера: \`${server?.id}\``)
        .setColor(0xFFF4D8)
        .setThumbnail(server?.iconURL() || null)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()

    await msg.reply({ embeds: [embed] });
});