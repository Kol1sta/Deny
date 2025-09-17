import path from 'node:path';

import Client from './services/client';
import { Events } from './services/events';
import { Commands } from './services/commands';
import './utils/load-env';

async function main() {
    const client: Client = new Client();
    new Events(path.join(__dirname, 'events'), client);

    await client.login(process.env.TOKEN);
    new Commands(path.join(__dirname, 'commands'), client);
}

main().catch(console.error);
