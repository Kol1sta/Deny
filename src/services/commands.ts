import path from 'node:path';
import fs from 'node:fs/promises';
import { SlashCommandBuilder } from 'discord.js';

import Client from './client';

export interface CommandItemOptions {
    name: string,
    desc?: string
}

export class CommandItem {
    public readonly options: CommandItemOptions;
    public readonly execute: (...args:any[])=>Promise<void>|void;
    public readonly slash: SlashCommandBuilder;

    constructor(options:CommandItemOptions, execute:(...args: any[]) => Promise<void> | void) {
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

    constructor(path: string, client: Client) {
        this.path = path;
        this.client = client;

        this.loadCommands();
    }

    private async loadCommands() {
        const files = (await fs.readdir(this.path, { recursive: true })).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

        try {
            for(const file of files) {
                const commandImport = await import(path.join(this.path, file));
                const command: CommandItem = commandImport.default;

                if(!command || !command.options || !command.execute) {
                    console.warn(`Skipping invalid command file`);
                    continue;
                }

                // FIX IT LATER
                // if(file.split('.')[0] != command.options.name) {
                //     console.warn(`Skipping invalid command file`);
                //     continue;
                // }

                this.client.commands.set(command.options.name, { 
                    name: command.options.name,
                    execute: command.execute 
                });
            }
        } catch(e) {
            console.error(`Error importing command file: `, e);
        }
    }
}