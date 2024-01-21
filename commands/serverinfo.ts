import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'serverinfo',
    triggers: ['serverinfo'],
    info: {
        type: 'Utility',
        name: 'serverinfo',
        description: 'Shows information about the server',
        usage: 'serverinfo',
        examples: ['serverinfo'],
        blockDM: true,
        aliases: ['serverinfo'],
    },
    blockDM: true,
    disabled: false,
    type: {
        slash: true,
        text: true,
    },
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Shows information about the server'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const g = interaction.guild;
            if (!g) return;
            const data = {
                guildId: g.id,
                guildName: g.name,
                guildOwner: (await g.fetchOwner()),
                guildMembers: {
                    total: g.memberCount,
                    bots: g.members.cache.filter(member => member.user.bot).size,
                    humans: g.members.cache.filter(member => !member.user.bot).size,
                },
                guildChannels: {
                    total: g.channels.cache.size,
                    text: g.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size,
                    voice: g.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size,
                    category: g.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size,
                    announcements: g.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size,
                    stage: g.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size,
                },
                guildRoles: g.roles.cache.size,
                guildCreatedAt: g.createdTimestamp,
                guildEmojis: {
                    total: g.emojis.cache.size,
                    animated: g.emojis.cache.filter(emoji => emoji.animated).size,
                    static: g.emojis.cache.filter(emoji => !emoji.animated).size,
                },
                guildIcon: g.iconURL(),
            }
            const embed = client.embed()
                .setTitle(`Info for ${g.name}`)
                .addFields(
                    {
                        name: 'Owner',
                        value: data.guildOwner.toString(),
                    },
                    {
                        name: 'Members',
                        value: `Total: ${data.guildMembers.total}\nBots: ${data.guildMembers.bots}\nHumans: ${data.guildMembers.humans}`,
                    },
                    {
                        name: 'Channels',
                        value: `Total: ${data.guildChannels.total}\nText: ${data.guildChannels.text}\nVoice: ${data.guildChannels.voice}\nCategory: ${data.guildChannels.category}\nAnnouncements: ${data.guildChannels.announcements}\nStage: ${data.guildChannels.stage}`,
                    },
                    {
                        name: 'Roles',
                        value: data.guildRoles.toString(),
                    },
                    {
                        name: 'Emojis',
                        value: `Total: ${data.guildEmojis.total}\nAnimated: ${data.guildEmojis.animated}\nStatic: ${data.guildEmojis.static}`,
                    },
                    {
                        name: 'Created At',
                        value: `<t:${client.Utils.Time.unixTime(data.guildCreatedAt)}:F>`,
                    },
                )
                .setColor(0xa331d4)
                .setThumbnail(data.guildIcon);
            await interaction.reply({ embeds: [embed] });
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const g = message.guild;
            if (!g) return;
            const data = {
                guildId: g.id,
                guildName: g.name,
                guildOwner: (await g.fetchOwner()),
                guildMembers: {
                    total: g.memberCount,
                    bots: g.members.cache.filter(member => member.user.bot).size,
                    humans: g.members.cache.filter(member => !member.user.bot).size,
                },
                guildChannels: {
                    total: g.channels.cache.size,
                    text: g.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size,
                    voice: g.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size,
                    category: g.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size,
                    announcements: g.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size,
                    stage: g.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size,
                },
                guildRoles: g.roles.cache.size,
                guildCreatedAt: g.createdTimestamp,
                guildEmojis: {
                    total: g.emojis.cache.size,
                    animated: g.emojis.cache.filter(emoji => emoji.animated).size,
                    static: g.emojis.cache.filter(emoji => !emoji.animated).size,
                },
                guildIcon: g.iconURL(),
            }
            const embed = client.embed()
                .setTitle(`Info for ${g.name}`)
                .addFields(
                    {
                        name: 'Owner',
                        value: data.guildOwner.toString(),
                    },
                    {
                        name: 'Members',
                        value: `Total: ${data.guildMembers.total}\nBots: ${data.guildMembers.bots}\nHumans: ${data.guildMembers.humans}`,
                    },
                    {
                        name: 'Channels',
                        value: `Total: ${data.guildChannels.total}\nText: ${data.guildChannels.text}\nVoice: ${data.guildChannels.voice}\nCategory: ${data.guildChannels.category}\nAnnouncements: ${data.guildChannels.announcements}\nStage: ${data.guildChannels.stage}`,
                    },
                    {
                        name: 'Roles',
                        value: data.guildRoles.toString(),
                    },
                    {
                        name: 'Emojis',
                        value: `Total: ${data.guildEmojis.total}\nAnimated: ${data.guildEmojis.animated}\nStatic: ${data.guildEmojis.static}`,
                    },
                    {
                        name: 'Created At',
                        value: `<t:${client.Utils.Time.unixTime(data.guildCreatedAt)}:F>`,
                    },
                )
                .setColor(0xa331d4)
                .setThumbnail(data.guildIcon);
            await message.reply({ embeds: [embed] });
        })
} as CommandExport;