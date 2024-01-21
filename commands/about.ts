import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'about',
    triggers: ['about', 'details'],
    info: {
        type: 'Informational',
        name: 'about',
        description: 'Get info about the bot.',
        usage: 'about',
        examples: ['about', 'details'],
        blockDM: true,
        aliases: ['about', 'details'],
    },
    blockDM: true,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get info about the bot'),
    executors: new Executors()
    .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
        const imageURL = "https://cdn.discordapp.com/attachments/1078326760539684864/1089361508196159609/IMG_2351.png" // Developer Note: I typed this out by hand. Stupid school blocks Discord.
        const embed = client.embed()
            .setAuthor(
                {
                    name: 'FemDevs',
                    iconURL: imageURL,
                    url: 'https://github.com/FemDevs'
                }
            )
            .setTitle('About the bot')
            .setDescription('This is a private bot originally created by Alex. We then moved it over to FemDevs, which includes Benpai and Oblong too.')
            .addFields(
                {
                    name: 'Developers',
                    value: [
                        '<@505458216474378271> - Oblong',
                        '<@530748350119673896> - Alex',
                        '<@957352586086875216> - Benpai'
                    ].join('\n')
                }
            )
            .setFooter(
                {
                    text: 'Made with humor by FemDevs',
                    iconURL: imageURL
                }
            )
            .setTimestamp()
            .setColor(Math.floor(Math.random() * Math.pow(16, 6)))
        interaction.reply({ embeds: [embed] });
    })
    .set('text', async (client: ClientInterface, message: Message) => {
        const imageURL = "https://cdn.discordapp.com/attachments/1078326760539684864/1089361508196159609/IMG_2351.png" // Developer Note: I typed this out by hand. Stupid school blocks Discord.
        const embed = client.embed()
            .setAuthor(
                {
                    name: 'FemDevs',
                    iconURL: imageURL,
                    url: 'https://github.com/FemDevs'
                }
            )
            .setTitle('About the bot')
            .setDescription('This is a private bot originally created by Alex. We then moved it over to FemDevs, which includes Benpai and Oblong too.')
            .addFields(
                {
                    name: 'Developers',
                    value: [
                        '<@505458216474378271> - Oblong',
                        '<@530748350119673896> - Alex',
                        '<@957352586086875216> - Benpai'
                    ].join('\n')
                },
            )
            .setFooter(
                {
                    text: 'Made with humor by FemDevs',
                    iconURL: imageURL
                }
            )
            .setTimestamp()
            .setColor(Math.floor(Math.random() * Math.pow(16, 6)))
        message.reply({ embeds: [embed] });
    })
} as CommandExport;