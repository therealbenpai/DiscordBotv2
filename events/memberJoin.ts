import { Events, GuildMember, TextChannel } from 'discord.js';
import { EventExport, ClientInterface } from '../types';

export default {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client: ClientInterface, member: GuildMember) {
        const welcomeChannelId = '1125106402264879196'
        const welcomeChannel = await client.channels.fetch(welcomeChannelId)
        const avatarURL = member.displayAvatarURL()
        const welcomeEmbed = client.embed()
            .setTitle(`${member.displayName} joined!`)
            .setDescription('Welcome! Please read the server rules before chatting with other members. Have fun!')
            .setThumbnail(avatarURL)
            .setColor('Blurple')
        if (!(welcomeChannel instanceof TextChannel)) return
        await welcomeChannel.send({ embeds: [welcomeEmbed] })
    }
} as EventExport;