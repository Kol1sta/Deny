import axios from "axios";
import { Message, EmbedBuilder } from "discord.js";

interface ActionOptions {
    msg: Message,
    tag: string,
    title: string
}

export default async function getActionFromTag(options: ActionOptions) {
    try {
        const res = await axios.get(`https://api.waifu.pics/sfw/${options.tag}`);
        const url =  res.data.url;

        const embed = new EmbedBuilder()
            .setTitle(options.title)
            .setImage(url)
            .setColor(0xFFF4D8)
            .setFooter({ text: `Запрошено ${options.msg.author.tag}`, iconURL: options.msg.author.avatarURL() || undefined })
            .setTimestamp()
        
        await options.msg.reply({ embeds: [embed] });
    } catch(e) {
        console.log(e);
    }   
}