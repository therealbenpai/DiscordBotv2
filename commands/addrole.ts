import { ChatInputCommandInteraction, Message, SlashCommandBuilder, PermissionFlagsBits, GuildMemberRoleManager, Role, GuildMember } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'addrole',
    triggers: ['addrole'],
    info: {
        type: 'Moderation',
        name: 'addrole',
        description: 'Add a role to a user.',
        usage: 'addrole <user> <role>',
        examples: ['addrole @Alex#0001 @Moderator'],
        permissions: ['ManageRoles'],
        blockDM: true,
        aliases: ['addrole'],
    },
    requiredPerm: PermissionFlagsBits.ManageRoles,
    blockDM: true,
    disabled: false,
    type: {
        slash: true,
        text: false
    },
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Add a role to a user.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The user to add the role to')
                .setRequired(true))
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to add to the user')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const member = interaction.options.getMember('member');
            if (!(member instanceof GuildMember)) return interaction.reply({ content: 'That is not a valid member.', ephemeral: true });
            const role = interaction.options.getRole('role')!;
            if (!(role instanceof Role)) return interaction.reply({ content: 'That is not a valid role.', ephemeral: true });

            try {
                const embed = client.embed()
                    .setTitle('Success!')
                    .setDescription(`${member} has been given the role ${role}.`)
                    .setColor(0x3dd11b)
                if (!(member.roles instanceof GuildMemberRoleManager)) return interaction.reply({ content: 'That is not a valid member.', ephemeral: true });
                await member.roles.add(role);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const error_embed = client.embed()
                    .setTitle('Error')
                    .setDescription(`It seems we encountered an error:\n\`${error}\``)
                    .setColor(0xd1271b)
                await interaction.reply({ embeds: [error_embed] })
                console.error(error);
            }
        })
} as CommandExport;