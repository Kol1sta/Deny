import { Message, EmbedBuilder } from "discord.js";
import path from "path";
import { CommandItem } from "../../services/commands";
import { readFile } from "fs/promises";

export default new CommandItem({ name: 'user' }, async (msg: Message) => {
    let user = msg.mentions.users.first();
    if(!user) user = msg.author;

    const member = await msg.guild?.members.fetch(user.id);

    const repFilePath = path.join(process.cwd(), 'resources', 'replist.txt');
    let rep: number = 0;

    try {
        const fileContent = await readFile(repFilePath, 'utf8');
        const lines = fileContent.split('\n');

        for(const line of lines) {
            if(!line.trim()) continue;

            const [userId, repValue] = line.trim().split(/\s+/);

            if(userId === user.id && repValue) {
                const parsedRep = parseInt(repValue);
                if(!isNaN(parsedRep)) {
                    rep = parsedRep;
                }
                break;
            }
        }
    } catch (error) {
        console.log(error);
        rep = 0;
    }

    const embed = new EmbedBuilder()
        .setTitle(`Пользователь ${user.displayName}`)
        .setDescription(`\`Имя пользователя\`: ${user.tag}
\`Айди\`: ${member?.id}
\`Статус\`: ${member?.presence?.status || 'offline'}
\`Репутация\`: ${rep}`)
        .setColor(0xFFF4D8)
        .setThumbnail(user.avatarURL() || null)
        .setFooter({ text: `Запрошено ${msg.author.tag}`, iconURL: msg.author.avatarURL() || undefined })
        .setTimestamp()

    await msg.reply({ embeds: [embed] });
});
