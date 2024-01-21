import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

import fs from 'fs'

export default {
    name: 'thegoods',
    triggers: ['thegoods'],
    info: {
        type: 'Fun',
        name: 'thegoods',
        description: 'Take a guess',
        usage: 'thegoods',
        examples: ['thegoods'],
        blockDM: false,
        aliases: ['thegoods'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('thegoods')
        .setDescription('Take a guess'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const fileData = fs.readFileSync(`${__dirname}/../assets/audio/thegoods.mp3`);
            const file = new AttachmentBuilder(fileData, { name: 'theGoods.mp3' });
            await interaction.reply({ content: 'Credit: Benpai', files: [file] });
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const fileData = fs.readFileSync(`${__dirname}/../assets/audio/thegoods.mp3`);
            const file = new AttachmentBuilder(fileData, { name: 'theGoods.mp3' });
            await message.reply({ content: 'Credit: Benpai', files: [file] });
        })
} as CommandExport;