import { StringSelectMenuBuilder, SelectMenuInteraction, StringSelectMenuOptionBuilder } from 'discord.js';
import { SelectMenuExport, ClientInterface } from '../../types';

export default {
    name: 'NAME',
    info: {
        name: 'NAME',
        description: 'DESCRIPTION',
    },
    data: new StringSelectMenuBuilder()
        .setCustomId('NAME')
        .setPlaceholder('Placeholder')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Label')
                .setValue('Value')
                .setDescription('Description')
        ),
    async execute(client: ClientInterface, interaction: SelectMenuInteraction) {
        // Do stuff here
    }
} as SelectMenuExport;