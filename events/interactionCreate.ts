import {
    Events,
    ContextMenuCommandInteraction,
    ButtonInteraction,
    StringSelectMenuInteraction,
    ModalSubmitInteraction,
    ChatInputCommandInteraction,
    BaseInteraction
} from 'discord.js';
import { EventExport, ClientInterface } from '../types';

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(client: ClientInterface, interaction: BaseInteraction) {
        client.bumpEvent(Events.InteractionCreate);
        if (interaction.isAutocomplete()) return client.Commands.get(interaction.commandName)!.executors.get('autocomplete')(client, interaction);
        if (interaction instanceof ChatInputCommandInteraction) {
            const command = client.Commands.get(interaction.commandName);
            if (!command || !command.type.slash) return;
            client.runtimeStats.commands.bump('slashExecuted');
            (command.blockDM && interaction.channel!.isDMBased()) ?
                interaction.reply({ content: client.configs.defaults.dmDisabled }) :
                (command.channelLimits && !command.channelLimits.includes(interaction.channel!.type)) ?
                    interaction.reply({ content: client.configs.defaults.invalidChannelType }) :
                    (command.requiredPerm && interaction.guild && !interaction.member.permissions.has(command.requiredPerm)) ?
                        interaction.reply({ content: client.configs.defaults.noPerms }) :
                        (command.allowedRoles && !interaction.member.roles.cache.some(role => command.allowedRoles!.includes(role.id))) ?
                            interaction.reply({ content: client.configs.defaults.noPerms }) :
                            (command.allowedUsers && !command.allowedUsers.includes(interaction.user.id)) ?
                                interaction.reply({ content: client.configs.defaults.noPerms }) :
                                (command.disabled) ?
                                    interaction.reply({ content: client.configs.defaults.disabled }) :
                                    command.executors.get('slash')(client, interaction);
        }
        else if (interaction instanceof ContextMenuCommandInteraction) {
            client.runtimeStats.components.contextMenus.bump("executed");
            //@ts-expect-error
            return client.Components.get('contextMenus')!.get(interaction.commandName)!.execute(client, interaction)
        }
        else if (interaction instanceof ButtonInteraction) {
            client.runtimeStats.components.buttons.bump("executed");
            //@ts-expect-error
            return client.Components.get('buttons')!.get(interaction.customId)!.execute(client, interaction)
        }
        else if (interaction instanceof StringSelectMenuInteraction) {
            client.runtimeStats.components.selectMenus.bump("executed");
            //@ts-expect-error
            return client.Components.get('selectMenus')!.get(interaction.customId)!.execute(client, interaction)
        }
        else if (interaction instanceof ModalSubmitInteraction) {
            client.runtimeStats.components.modals.bump("executed");
            //@ts-expect-error
            return client.Components.get('selectMenus')!.get(interaction.customId)!.execute(client, interaction)
        }
        //@ts-expect-error
        else return await interaction.reply({ content: 'This interaction is not supported yet.', ephemeral: true })
        // Do stuff here
    },
} as EventExport;