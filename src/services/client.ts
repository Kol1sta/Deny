import { Client as DSClient, GatewayIntentBits, Collection } from 'discord.js';

export default class Client extends DSClient {
    public readonly commands: Collection<string, any>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commands = new Collection<string, any>();
    }

    public getCommandByName(name: string) {
        return this.commands.find(cmd => cmd.name === name);
    }

    public setCommand(name: string, execute: () => void) {
        this.commands.set(name, {
            name: name,
            execute: execute
        });
    }
}
