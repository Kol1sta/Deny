import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import * as path from 'node:path';
import * as fs from 'node:fs';

config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    throw new Error('Отсутствуют необходимые переменные окружения (TOKEN, CLIENT_ID, GUILD_ID). Проверьте файл .env');
}

const rest = new REST().setToken(TOKEN);

async function deployCommands() {
    try {
        const commands: any[] = [];
        const commandsPath = path.join(__dirname, 'commands');

        async function readCommands(dir: string) {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                
                if (item.isDirectory()) {
                    await readCommands(fullPath);
                } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.ts'))) {
                    try {
                        let commandModule;
                        if (item.name.endsWith('.ts')) {
                            commandModule = await import(fullPath);
                        } else {
                            commandModule = require(fullPath);
                        }
                        
                        const command = commandModule.default;
                        
                        if (command?.data) {
                            commands.push(command.data);
                            console.log(`Добавлена команда: ${command.data.name} (из ${fullPath})`);
                        } else {
                            console.log(`Файл ${fullPath} не экспортирует команду в правильном формате`);
                        }
                    } catch (error) {
                        console.error(`Ошибка при загрузке команды из ${fullPath}:`, error);
                    }
                }
            }
        }

        await readCommands(commandsPath);

        console.log(`Начало регистрации ${commands.length} команд...`);

        if (commands.length === 0) {
            console.log('Не найдено команд для регистрации');
            return;
        } 

        // !!!!!!!!!!!!!!!!!!
        // Используем ненулевое утверждение, указываем ебучему TS
        // что CLIENT_ID и GUILD_ID точно являются строками
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!),
            { body: commands }
        ) as any[];

        console.log(`Успешно зарегистрировано ${data.length} команд.`);
    } catch (error) {
        console.error('Ошибка при регистрации команд:', error);
    }
}

deployCommands();