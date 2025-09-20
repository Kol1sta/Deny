import { Message } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { CommandItem } from "../../../services/commands";

interface RepCooldown {
    [targetId: string]: string[];
}

export default new CommandItem({ name: 'rep-' }, async (msg: Message) => {
    let user = msg.mentions.users.first();
    if(!user) {
        await msg.reply("Участник не выбран");
        return;
    } else if(user.bot) {
        await msg.reply("Нельзя менять репутацию боту");
        return;
    } else if(user.id === msg.author.id) {
        await msg.reply("Нельзя менять свою репутацию");
        return;
    }

    try {
        const repFilePath = path.join(process.cwd(), 'resources', 'replist.txt');
        const cooldownFilePath = path.join(process.cwd(), 'resources', 'repcooldown.json');

        let cooldownData: RepCooldown = {};
        try {
            const cooldownFile = await readFile(cooldownFilePath, 'utf-8');
            cooldownData = JSON.parse(cooldownFile);
        } catch (err) {
            cooldownData = {};
        }

        if(cooldownData[user.id] && cooldownData[user.id].includes(msg.author.id)) {
            await msg.reply("Вы уже меняли репутацию этому участнику!");
            return;
        }

        let sourceFile = '';
        try {
            sourceFile = await readFile(repFilePath, 'utf-8');
        } catch (err) {
            sourceFile = '';
        }

        const lines = sourceFile.split('\n').filter(line => line.trim());
        let userFound = false;
        let newRep = -1;

        const updatedLines = lines.map(line => {
            const params = line.split(' ');
            if(params[0] === user.id && params[1]) {
                userFound = true;
                const currentRep = parseInt(params[1]) || 0;
                newRep = currentRep - 1;
                return `${user.id} ${newRep}`;
            }

            return line;
        });

        if(!userFound) {
            updatedLines.push(`${user.id} ${newRep}`);
        }

        await writeFile(repFilePath, updatedLines.join('\n') + '\n', 'utf-8');

        if(!cooldownData[user.id]) cooldownData[user.id] = [];
        cooldownData[user.id].push(msg.author.id);

        await writeFile(cooldownFilePath, JSON.stringify(cooldownData, null, 2), 'utf-8');

        await msg.reply({
            content: `Репутация участника ${user.tag} успешно изменена на ${newRep}`
        });
    } catch(err) {
        await msg.reply("Не удалось обновить репутацию");
        console.log('Ошибка:', err);
    }
});
