import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'ban',
    triggers: ['ban'],
    info: {
        type: 'Moderation',
        name: 'ban',
        description: 'Ban a user from the server.',
        usage: 'ban <user> [reason]',
        examples: ['ban @Alex#0001 Spamming.'],
        permissions: ['BanMembers'],
        blockDM: true,
        aliases: ['ban'],
    },
    blockDM: true,
    disabled: false,
    requiredPerm: PermissionFlagsBits.BanMembers,
    type: {
        slash: true,
        text: false
    },
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Choose who to ban.')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Describe why you are banning the user.')
            .setRequired(false)
        ) as SlashCommandBuilder,
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const member = interaction.options.getMember('member');
            const user = interaction.options.getUser('member');
            const reason = interaction.options.getString('reason');

            if (member === null) return interaction.reply({ content: 'That is not a valid member.', ephemeral: true });
            if (!(member instanceof GuildMember)) return interaction.reply({ content: 'That is not a valid member.', ephemeral: true });

            if (user!.id === client.user!.id) {
                const embed = client.embed()
                    .setTitle('Whoops!')
                    .setDescription('I can\'t ban myself!');
                await interaction.reply({ embeds: [embed] });
            } else if (user!.id === interaction.user.id) {
                const embed = client.embed()
                    .setTitle('Whoops!')
                    .setDescription('You can\'t ban yourself!');
                await interaction.reply({ embeds: [embed] });
            } else {
                try {
                    const success_embed = client.embed()
                        .setTitle('Success!')
                        .setDescription(`${member} was successfully banned.\n\n**Reason**\n${reason}`);
                    await interaction.guild!.members.ban(member, { reason: reason ?? '' });
                    await interaction.reply({ embeds: [success_embed] });
                } catch (error) {
                    const error_embed = client.embed()
                        .setTitle('Error')
                        .setDescription(`It seems we encountered an error:\n\`${error}\``);
                    await interaction.reply({ embeds: [error_embed], ephemeral: true });
                    return void error;
                }
            };
        })
} as CommandExport;