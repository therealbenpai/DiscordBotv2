import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import { ButtonExport, ClientInterface } from '../../types';

export default {
    name: 'customID',
    info: {
        name: 'customID',
        description: 'Button Description',
    },
    data: new ButtonBuilder()
        .setCustomId('customID')
        .setLabel('Button Label')
        .setStyle(ButtonStyle.Primary),
    async execute(client: ClientInterface, interaction: ButtonInteraction) {
        // Do stuff here
    }
} as ButtonExport;