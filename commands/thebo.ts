import { ChatInputCommandInteraction, SlashCommandBuilder, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';
// @ts-ignore
const thebo = [
    "https://cdn.discordapp.com/attachments/1040327100181270679/1077283426987679824/theboys.png",
    "https://media.discordapp.net/attachments/1040327100181270679/1077283454045147296/the_bo.jpg?width=691&height=559",
    "https://media.discordapp.net/attachments/1040327100181270679/1077283727870271529/image.png",
    "https://media.discordapp.net/attachments/1040327100181270679/1077283850935336960/the-boys-saison-3-1.png?width=894&height=559",
    "https://img.seriesonline.gg/xxrz/250x400/418/d7/64/d76490dba9831502963013285425627e/d76490dba9831502963013285425627e.jpg",
    "https://media.discordapp.net/attachments/1029055191120617563/1089610616790073404/Screenshot_2023-03-26_at_19.03.21.png"
]

export default {
    name: 'thebo',
    triggers: ['thebo'],
    info: {
        type: 'Fun',
        name: 'thebo',
        description: 'THE BO',
        usage: 'thebo',
        examples: ['thebo'],
        blockDM: false,
        aliases: ['thebo'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('thebo')
        .setDescription('THE BO'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            await interaction.reply(thebo[Math.floor(Math.random() * thebo.length)]);
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            await message.reply(thebo[Math.floor(Math.random() * thebo.length)]);
        }),
} as CommandExport;