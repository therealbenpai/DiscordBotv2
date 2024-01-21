import { ChannelType, Message } from "discord.js";
import { TriggerExport, ClientInterface } from '../types';

export default {
    name: 'example',
    globalDisable: false,
    triggerCfgs: {
        channel: {
            activated: false,
            requirePrefix: true,
            ids: [],
            types: []
        },
        role: {
            activated: false,
            requirePrefix: true,
            ids: [],
        },
        user: {
            activated: false,
            requirePrefix: true,
            ids: [],
        },
        message: {
            activated: false,
            requirePrefix: true,
            prefixes: [],
            contains: [],
            suffixes: [],
            regex: []
        }
    },
    async execute(client: ClientInterface, message: Message) {
        // Do stuff here
    }
} as TriggerExport;