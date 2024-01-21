import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js';
import { ContextMenuExport, ClientInterface } from '../../types';

module.exports = {
    name: 'NAME',
    info: {
        name: 'NAME',
        description: 'DESCRIPTION',
    },
    data: new ContextMenuCommandBuilder()
        .setName('NAME')
        .setType(ApplicationCommandType.User),
    async execute(client: ClientInterface, interaction: ContextMenuCommandInteraction) {
        const targetUser = client.users.cache.get(interaction.targetId)!;
        const targetMember = interaction.guild!.members.cache.get(interaction.targetId)!;
        // run some code here
    }
} as ContextMenuExport;