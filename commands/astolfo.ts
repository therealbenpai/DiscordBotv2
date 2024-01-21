import { SlashCommandBuilder, ChatInputCommandInteraction, Message } from 'discord.js';
import { Executors } from '..';
import { CommandExport, ClientInterface } from '../types';

export default {
    name: 'astolfo',
    triggers: ['astolfo'],
    info: {
        type: 'Fun',
        name: 'astolfo',
        description: 'Post a random image from r/astolfo.',
        usage: 'astolfo',
        examples: ['astolfo'],
        blockDM: false,
        aliases: ['astolfo'],
    },
    blockDM: false,
    disabled: false,
    type: {
        slash: true,
        text: true
    },
    data: new SlashCommandBuilder()
        .setName('astolfo')
        .setDescription('Post a random image from r/astolfo.'),
    executors: new Executors()
        .set('slash', async (client: ClientInterface, interaction: ChatInputCommandInteraction) => {
            await interaction.deferReply();
            await fetch(`https://www.reddit.com/r/astolfo/random/.json`)
                .then(response => response.json())
                .then(data => {
                    const validLinks = data.data.children.filter((post: { data: { post_hint: string; }; }) => post.data.post_hint == 'image');
                    const randomLink = validLinks[Math.floor(Math.random() * validLinks.length)];
                    const embed = client.embed()
                        .setTitle(randomLink.data.title)
                        .setURL(randomLink.data.url)
                        .setImage(randomLink.data.url)
                        .setTimestamp()

                    interaction.editReply({ embeds: [embed] });
                })
        })
        .set('text', async (client: ClientInterface, message: Message) => {
            const { data } = (await fetch(`https://www.reddit.com/r/astolfo/random/.json`).then(response => response.json()))
            const validLinks = data.children.filter((post: { data: { post_hint: string; }; }) => post.data.post_hint == 'image');
            const randomLink = validLinks[Math.floor(Math.random() * validLinks.length)];
            const embed = client.embed()
                .setTitle(randomLink.data.title)
                .setURL(randomLink.data.url)
                .setImage(randomLink.data.url)
                .setTimestamp()

            message.reply({ embeds: [embed] });
        })
} as CommandExport;