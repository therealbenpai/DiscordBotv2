import { SlashCommandBuilder, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'botstatus',
    triggers: ['botstatus', 'status', 'stats'],
    info: {
        type: 'Utility',
        name: 'botstatus',
        description: 'Bot Status',
        usage: 'botstatus',
        examples: ['botstatus'],
        blockDM: false,
        aliases: ['botstatus', 'status', 'stats'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('botstatus')
        .setDescription('Bot Status'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            const data = client.stats()
            const embed = client.embed()
                .setTitle('Bot Status')
                .setColor(parseInt(client.Utils.Random.randHex(), 16))
                .setDescription('Bot Status')
                .setFooter({
                    text: 'Bot Status | Made by FemDevs',
                })
                .setTimestamp()
                .addFields(
                    {
                        name: 'Uptime',
                        value: String(data.uptime)
                    },
                    {
                        name: 'Ping',
                        value: data.ping + 'ms'
                    },
                    {
                        name: 'Memory',
                        value: `${data.ram.botOnly.rawValue} ${data.ram.botOnly.unit}`
                    }
                )
            interaction.reply({ embeds: [embed] })
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const data = client.stats()
            const embed = client.embed()
                .setTitle('Bot Status')
                .setColor(parseInt(client.Utils.Random.randHex(), 16))
                .setDescription('Bot Status')
                .setFooter({
                    text: 'Bot Status | Made by FemDevs',
                })
                .setTimestamp()
                .addFields(
                    {
                        name: 'Uptime',
                        value: String(data.uptime)
                    },
                    {
                        name: 'Ping',
                        value: data.ping + 'ms'
                    },
                    {
                        name: 'Memory',
                        value: `${data.ram.botOnly.rawValue} ${data.ram.botOnly.unit}`
                    }
                )
            message.reply({ embeds: [embed] })
        })
} as CommandExport;