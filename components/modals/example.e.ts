import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } from 'discord.js';
import { ModalExport, ClientInterface } from '../../types';

export default {
    name: 'NAME',
    info: {
        name: 'NAME',
        description: 'DESCRIPTION',
        type: 'Base Modal',
    },
    data: new ModalBuilder()
        .setCustomId('NAME')
        .setTitle('TITLE')        
        .addComponents(
            //@ts-expect-error
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('INPUT')
                        .setPlaceholder('Placeholder')
                        .setStyle(TextInputStyle.Short)
                        .setLabel('Label')
                )
        ),
    async execute(client: ClientInterface, interaction: ModalSubmitInteraction) {
        // Do stuff here
    }
} as ModalExport;
