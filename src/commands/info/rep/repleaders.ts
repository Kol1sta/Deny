import { EmbedBuilder, Message } from "discord.js";
import { readFile } from "fs/promises";
import path from "path";
import { CommandItem } from "../../../services/commands";

export default new CommandItem({ name: 'repleaders' }, async (msg: Message) => {
    const repFilePath = path.join(process.cwd(), 'resources', 'replist.txt');

    let sourceFile = '';
    try {
        sourceFile = await readFile(repFilePath, 'utf-8');
    } catch (err) {
        sourceFile = '';
    }

    const lines = sourceFile.split('\n').filter(line => line.trim());
    const users = lines.map(line => {
        const params = line.split(' ');
        const userId = params[0];
        const rep = parseInt(params[1]) || 0;
        return { userId, rep };
    });

    const top10 = users.sort((a, b) => b.rep - a.rep).slice(0, 10);

    if (top10.length === 0) {
        await msg.reply('Список репутации пуст');
        return;
    }

    const leaderboard = top10.map((user, index) => `${index + 1}. <@${user.userId}>: \`${user.rep}\``).join('\n');
    const embed = new EmbedBuilder()
        .setTitle("Лидеры по репутации")
        .setDescription(leaderboard)
        .setColor(0xFFF4D8)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()

    await msg.reply({ embeds: [embed] });
});
