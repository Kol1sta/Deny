import { Message } from "discord.js";
import { CommandItem } from "../services/commands";

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default new CommandItem({ name: 'rand' }, async (msg: Message, args) => {
    if(args.length < 2) {
        await msg.reply("Введите два числа для диапазона");
        return;
    }

    await msg.reply({ content: getRandomInt(parseInt(args[0]), parseInt(args[1])).toString() });
});