import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'ping',
    triggers: ['ping'],
    info: {
        type: 'Utility',
        name: 'ping',
        description: 'Replies with Pong!',
        usage: 'ping',
        examples: ['ping'],
        blockDM: false,
        aliases: ['ping'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            await interaction.reply('Pong!');
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            await message.reply('Pong!');
        })
} as CommandExport;