import { Message } from 'discord.js';
import { CommandItem } from '../../services/commands';

export default new CommandItem({ 
    name: 'calc'
}, async (msg: Message, args: string[]) => {
    if (args.length !== 3) {
        await msg.reply("Неверное количество аргументов. Используйте: `!calc <число> <операция> <число>`");
        return;
    }

    const num1 = parseFloat(args[0]);
    const operation = args[1];
    const num2 = parseFloat(args[2]);

    if (isNaN(num1) || isNaN(num2)) {
        await msg.reply("Оба аргумента должны быть числами!");
        return;
    }

    if (!['+', '-', '*', '/', 'x', '×'].includes(operation)) {
        await msg.reply("Некорректная операция. Доступные: `+`, `-`, `*`, `/`");
        return;
    }

    let result: number;
    
    switch(operation) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
        case 'x':
        case '×':
            result = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                await msg.reply("На ноль делить нельзя!");
                return;
            }
            result = num1 / num2;
            break;
        default:
            await msg.reply("Неизвестная операция");
            return;
    }

    const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
    
    await msg.reply(`**${num1} ${operation} ${num2} = ${formattedResult}**`);
});