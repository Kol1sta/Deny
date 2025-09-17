import path from 'node:path';
import fs from 'node:fs/promises';

import Client from './client';

export interface EventItemOptions {
    name: string,
    isOnce: boolean,
    desc?: string
}

export class EventItem {
    public readonly options: EventItemOptions;
    public readonly execute: (...args: any[]) => Promise<void> | void;

    constructor(options: EventItemOptions, execute: (...args: any[]) => Promise<void> | void) {
        this.options = options;
        this.execute = execute;
    }
}

export class Events {
    private readonly path: string;
    private readonly client: Client;

    constructor(path: string, client: Client) {
        this.path = path;
        this.client = client;

        this.loadEvents();
    }

    private async loadEvents() {
        const files = (await fs.readdir(this.path)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for(const file of files) {
            try {
                const eventImport = await import(path.join(this.path, file));
                const event: EventItem = eventImport.default;

                if(!event || !event.options || !event.execute) {
                    console.warn(`Skipping invalid event file`);
                    continue;
                }

                if(event.options.isOnce) {
                    this.client.once(event.options.name, (...args: Array<any>) => event.execute(...args, this.client));
                } else {
                    this.client.on(event.options.name, (...args: Array<any>) => event.execute(...args, this.client));
                }
            } catch(e) {
                console.error(`Error importing event file: `, e);
            }
        }
    }
}
