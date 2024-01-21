import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, TextChannel, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'announce',
    triggers: ['announce'],
    info: {
        type: 'Utility',
        name: 'announce',
        description: 'Make an announcement using the bot.',
        usage: 'announce <channel> <content> [attachment]',
        examples: ['announce #announcements Hello world!'],
        permissions: ['ModerateMembers'],
        blockDM: true,
        aliases: ['announce'],
    },
    blockDM: true,
    disabled: false,
    requiredPerm: PermissionFlagsBits.ModerateMembers,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Make an announcement using the bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('The channel to send the announcement in.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('content')
            .setDescription('Text that should be in the announcement.')
            .setRequired(true))
        .addAttachmentOption(option => option
            .setName('attachment')
            .setDescription('Attach media content to go with the announcement.')
            .setRequired(false)
        ) as SlashCommandBuilder,
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const channel = interaction.options.getChannel('channel');
            if (!(channel instanceof TextChannel)) return interaction.reply({ content: 'That is not a valid channel.', ephemeral: true });
            const content = interaction.options.getString('content');
            const attachment = interaction.options.getAttachment('attachment');

            const announcementEmbed = client.embed()
                .setTitle('New announcement')
                .setDescription(content)
                .setAuthor({
                    name: `Sent by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setColor(0xe31e35);

            const confirmationEmbed = client.embed()
                .setDescription(`**Announcement sent in ${channel}!**`)
                .setColor(0x2ed95b);

            if (attachment !== null) await channel.send({ embeds: [announcementEmbed], files: [attachment] });
            else await channel.send({ embeds: [announcementEmbed] });
            await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const { channel, attachments: files } = message;
            const content = message.content.slice(message.content.indexOf(' ') + 1);

            const announcementEmbed = client.embed()
                .setTitle('New announcement')
                .setDescription(content)
                .setAuthor({
                    name: `Sent by ${message.author.username}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setColor(0xe31e35);

            await channel.send({ embeds: [announcementEmbed], files: Array.from(files.values()) });
        })
} as CommandExport;