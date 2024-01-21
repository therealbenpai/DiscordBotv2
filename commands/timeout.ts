import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, GuildMember, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'timeout',
    triggers: ['timeout', 'mute'],
    info: {
        type: 'Moderation',
        name: 'Timeout',
        description: 'Timeout (mute) a member.',
        usage: 'timeout <member> <duration>',
        examples: ['timeout @Benpai 1h', 'timeout @Benpai 1h30m'],
        permissions: ['Mute Members'],
        blockDM: true,
        aliases: ['timeout', 'mute'],
    },
    requiredPerm: PermissionFlagsBits.MuteMembers,
    blockDM: true,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout (mute) a member.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Choose who to mute.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('duration')
                .setDescription('How long to mute the user for.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    channelLimits: [
        ChannelType.GuildText,
    ],
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const member = interaction.options.getMember('member');
            if (!(member instanceof GuildMember)) return interaction.reply('Invalid member!');
            const duration = interaction.options.getString('duration');
            const durationTime = client.Utils.Time.stringToMilliseconds(duration);
            if (typeof durationTime !== 'number') return interaction.reply('Invalid duration!');
            const durationFormatted = client.Utils.Time.elapsedTime(durationTime / 1000);

            const error_embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('I was unable to mute that member.')

            if (member.user === interaction.user) {
                const embed = new EmbedBuilder()
                    .setTitle('Whoops!')
                    .setDescription('You can\'t mute yourself!')
                await interaction.reply({ embeds: [embed] });
            } else if (member.user === client.user) {
                const embed = new EmbedBuilder()
                    .setTitle('Whoops!')
                    .setDescription('I can\'t mute myself!')
                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Success!')
                    .setDescription(`${member} was successfully muted for ${durationFormatted}`)
                await interaction.reply({ embeds: [embed] });
                member.disableCommunicationUntil(new Date(Date.now() + durationTime)).catch(err => interaction.followUp({ embeds: [error_embed] }))
            }
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const member = message.mentions.members!.first();
            if (!(member instanceof GuildMember)) return message.reply('Invalid member!');
            const args = message.content.split(' ').slice(1);
            const duration = client.Utils.Time.stringToMilliseconds(args.join(' '));
            if (typeof duration !== 'number') return message.reply('Invalid duration!');
            const durationFormatted = client.Utils.Time.elapsedTime(duration / 1000);

            const error_embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('I was unable to mute that member.')

            if (member.user === message.author) {
                const embed = new EmbedBuilder()
                    .setTitle('Whoops!')
                    .setDescription('You can\'t mute yourself!')
                await message.reply({ embeds: [embed] });
            } else if (member.user === client.user) {
                const embed = new EmbedBuilder()
                    .setTitle('Whoops!')
                    .setDescription('I can\'t mute myself!')
                await message.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Success!')
                    .setDescription(`${member} was successfully muted for ${durationFormatted}`)
                await message.reply({ embeds: [embed] });
                member.disableCommunicationUntil(
                    new Date(
                        Date.now() + duration
                    )
                ).catch(
                    err =>
                        message.reply(
                            {
                                embeds: [error_embed]
                            }
                        )
                );
            }
        })
} as CommandExport;