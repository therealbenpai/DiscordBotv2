import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember, Message } from 'discord.js';
import { Executors } from '..'
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'kick',
    triggers: ['kick'],
    info: {
        type: 'Moderation',
        name: 'kick',
        description: 'Kick a member from the server.',
        usage: 'kick <user> [reason]',
        examples: ['kick @Alex#0001 Spamming.'],
        permissions: ['KickMembers'],
        blockDM: true,
        aliases: ['kick'],
    },
    blockDM: true,
    disabled: false,
    requiredPerm: PermissionFlagsBits.KickMembers,
    type: {
        slash: true,
        text: false
    },
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Choose who to kick from the server.')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Describe why you are kicking this member.')
            .setRequired(false)) as SlashCommandBuilder,
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const user = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason');

            if (!(user instanceof GuildMember)) return interaction.reply({ content: 'That is not a valid member.', ephemeral: true });

            if (user.id === interaction.user.id) {
                const embed = client.embed()
                    .setTitle('Whoops!')
                    .setDescription('You can\'t kick yourself!')
                    .setColor(0xd1271b);
                await interaction.reply({ embeds: [embed] });
            } else if (user.id === client.user!.id) {
                const embed = client.embed()
                    .setTitle('Whoops!')
                    .setDescription('I can\'t kick myself!')
                    .setColor(0xd1271b);
                await interaction.reply({ embeds: [embed] });
            } else {
                const success_embed = client.embed()
                    .setTitle('Success!')
                    .setDescription(`${user} was kicked from ${interaction.guild!.name}.\n\n**Reason**\n${reason}`)
                    .setColor(0x3dd11b);
                await user.kick(reason ?? '');
                await interaction.reply({ embeds: [success_embed] });
            }
        })
} as CommandExport;