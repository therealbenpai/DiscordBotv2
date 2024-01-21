import { ChatInputCommandInteraction, Message, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'NAME',
    triggers: [],
    info: {
        type: 'Moderation',
        name: 'NAME',
        description: 'DESCRIPTION',
        usage: 'USAGE',
        examples: ['EXAMPLES'],
        permissions: ['Administrator'],
        blockDM: true,
        aliases: [],
    },
    requiredPerm: PermissionFlagsBits['Administrator'],
    channelLimits: [], // ChannelTypes
    allowedRoles: [], // Role IDs
    allowedUsers: [], // User IDs
    blockDM: true,
    type: {
        slash: true,
        text: true
    },
    disabled: false,
    data: new SlashCommandBuilder()
        .setName('NAME')
        .setDescription('DESCRIPTION'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            // Do stuff here
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            // Do stuff here
        }),
} as CommandExport;