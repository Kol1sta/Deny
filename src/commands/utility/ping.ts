import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';
import { Interaction } from "discord.js";

export default new CommandItem({
    name: 'ping',
    desc: 'test cmd'
}, async (msg: Message, interaction: Interaction) => {
    msg.reply(`pong and: ${interaction}`);
});