import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ChatInputCommandInteraction, Message, TextChannel } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'reset',
    triggers: ['reset'],
    info: {
        type: 'Moderation',
        name: 'reset',
        description: 'Reset the channel.',
        usage: 'reset',
        examples: ['reset'],
        permissions: ['ManageChannels'],
        blockDM: true,
        aliases: ['reset'],
    },
    blockDM: true,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    channelLimits: [
        ChannelType.GuildText,
        ChannelType.GuildVoice,
        ChannelType.GuildAnnouncement
    ],
    requiredPermissions: PermissionFlagsBits.ManageChannels,
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const channel = interaction.channel;
            if (!(channel instanceof TextChannel)) return interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
            await interaction.reply({ content: 'Resetting...' });
            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                const newChannel = channel.clone();
                channel.delete();
                newChannel.then(c => {
                    c.send({ content: 'Channel reset!' });
                })
            })
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const channel = message.channel;
            if (!(channel instanceof TextChannel)) return message.reply('This command can only be used in text channels.');
            await message.reply({ content: 'Resetting...' });
            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                const newChannel = channel.clone();
                channel.delete();
                newChannel.then(c => {
                    c.send({ content: 'Channel reset!' });
                })
            })
        })
} as CommandExport;