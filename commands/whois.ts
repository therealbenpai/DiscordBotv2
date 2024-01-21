import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Message, GuildMember } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'whois',
    triggers: ['whois'],
    info: {
        type: 'Utility',
        name: 'whois',
        description: 'Get information about a user.',
        usage: 'whois <user>',
        examples: ['whois @Benpai#0001'],
        blockDM: false,
        aliases: ['whois'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: false
    },
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Get information about a user.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Choose who you want to learn more about.')
                .setRequired(true)
        ) as SlashCommandBuilder,
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const member = interaction.options.getMember('member');
            if (!(member instanceof GuildMember)) return interaction.reply('Invalid member!');
            const user = interaction.options.getUser('member');
            if (!user) return interaction.reply('Invalid user!');

            try {
                const userEmbed = client.embed()
                    .setTitle(user.tag)
                    .setThumbnail(user.displayAvatarURL())
                    .addFields([
                        {
                            name: '_ _',
                            value: `**User ID:** \`${user.id}\`\n**Joined Discord:** <t:${Math.floor(user.createdTimestamp / 1000)}:f>\n**Joined Server:** <t:${Math.floor(member.joinedTimestamp! / 1000)}:f>`,
                            inline: false
                        },
                        {
                            name: `Roles [${member.roles.cache.size}]`,
                            value: `${member.roles.cache.map(role => role.toString()).join(' ')}\n`,
                            inline: true
                        },
                    ]);
                await interaction.reply({ embeds: [userEmbed] })
            } catch (error) {
                const error_embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`It seems we encountered an error:\n\`${error}\``)
                await interaction.reply({ embeds: [error_embed] });
                console.error(error);
            }
        })
} as CommandExport;