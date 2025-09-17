import path from 'node:path';
import fs from 'node:fs/promises';
import { SlashCommandBuilder, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

import Client from './client';

export interface CommandItemOptions {
    name: string,
    desc?: string
}

export class CommandItem {
    public readonly options: CommandItemOptions;
    public readonly execute: (...args: any[]) => Promise<void> | void;
    public readonly slash: SlashCommandBuilder;

    constructor(options: CommandItemOptions, execute: (...args: any[]) => Promise<void> | void) {
        this.options = options;
        this.execute = execute;

        this.slash = new SlashCommandBuilder()
            .setName(this.options.name)
            .setDescription(this.options.desc || 'Bot command');
    }
}

export class Commands {
    private readonly path: string;
    private readonly client: Client;
    private readonly rest: REST;

    constructor(path: string, client: Client) {
        this.path = path;
        this.client = client;
        this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

        this.loadCommands();
    }

    public async loadCommands() {
        const files = (await fs.readdir(this.path, { recursive: true })).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

        const commands = [];

        try {
            for(const file of files) {
                const commandImport = await import(path.join(this.path, file));
                const command: CommandItem = commandImport.default;

                if(!command || !command.options || !command.execute) {
                    console.warn(`Skipping invalid command file`);
                    continue;
                }

                this.client.commands.set(command.options.name, {
                    name: command.options.name,
                    execute: command.execute
                });

                commands.push(command.slash.toJSON());
            }

            // TODO: register slash commands later
            // await this.registerCommands(commands);
        } catch(e) {
            console.error(`Error importing command file: `, e);
        }
    }

    // @ts-ignore
    private async registerCommands(commands: any[]) {
        try {
            if(!this.client.user) {
                throw new Error('Client user is not available');
            }

            await this.rest.put(Routes.applicationGuildCommands("1364293130446176297", "1410374589132836926"), { body: commands });
        } catch(e) {
            console.log("Failed to register commands: " + e);
        }
    }
}
