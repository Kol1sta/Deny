import { Message } from "discord.js";
import { CommandItem } from "../../services/commands";
import getRandomInt from "../../utils/get-random-int";

export default new CommandItem({ name: 'rand' }, async (msg: Message, args: string[]) => {
    if(args.length < 2) {
        await msg.reply("Введите два числа для диапазона");
        return;
    }

    await msg.reply({ content: getRandomInt(parseInt(args[0]), parseInt(args[1])).toString() });
});