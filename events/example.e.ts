import { Events } from 'discord.js';
import { EventExport, ClientInterface } from '../types';

export default {
    name: Events.Debug,
    once: false,
    async execute(client: ClientInterface, ..._args: any[]) {
        client.runtimeStats.events.executed++;
        client.runtimeStats.events.singularEventExecutions[Events.Debug]++;
        // Do stuff here
    }
} as EventExport;