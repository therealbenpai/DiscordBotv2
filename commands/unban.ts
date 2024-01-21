import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'unban',
    triggers: ['unban'],
    info: {
        type: 'Moderation',
        name: 'unban',
        description: 'Unban a user from the server.',
        usage: 'unban <user>',
        examples: ['unban 123456789123456789'],
        permissions: ['BanMembers'],
        blockDM: false,
        aliases: ['unban'],
    },
    requiredPerm: PermissionFlagsBits.BanMembers,
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: false
    },
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Enter the ID of the person you wish to unban.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const member = interaction.options.getUser('member');
            const server = interaction.guild;

            const embed = new EmbedBuilder()
                .setTitle('Success!')
                .setDescription(`${member} has been unbanned`)

            try {
                await server!.members.unban(member!);
                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                const error_embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`It seems we encountered an error:\n\`${error}\``)
                await interaction.reply({ embeds: [error_embed], ephemeral: true });
                console.error(error);
            }
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const member = message.mentions.members?.first();
            const server = message.guild;

            const embed = new EmbedBuilder()
                .setTitle('Success!')
                .setDescription(`${member} has been unbanned`)

            try {
                await server!.members.unban(member!);
                await message.reply({ embeds: [embed] });
            } catch (error) {
                const error_embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`It seems we encountered an error:\n\`${error}\``)
                await message.reply({ embeds: [error_embed] });
                console.error(error);
            }
        }),
} as CommandExport;