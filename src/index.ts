import path from 'node:path';

import Client from './services/client';
import { Events } from './services/events';
import { Commands } from './services/commands';
import './utils/load-env';

const client:Client = new Client();
new Events(path.join(__dirname, 'events'), client);
new Commands(path.join(__dirname, 'commands'), client);

client.login(process.env.TOKEN);