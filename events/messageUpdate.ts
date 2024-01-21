import { ChannelType, Events, Message } from 'discord.js';
import { EventExport, ClientInterface } from '../types';

export default {
    name: Events.MessageUpdate,
    once: false,
    async execute(client: ClientInterface, oldMessage: Message, newMessage: Message) {
        client.bumpEvent(Events.MessageUpdate);
        // Ignore if the message is the same, if the author is a bot, if the message is in a DM, or if the message is partial
        if (newMessage.content === oldMessage.content ||
            newMessage.author.bot ||
            newMessage.channel.type === ChannelType.DM ||
            newMessage.partial) return;

        // Code for triggers
        if (newMessage.content.startsWith(client.configs.prefix)) {
            const commandBase = newMessage.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();
            const data = client.Commands.get(commandBase);
            if (!data || !data.type.text) return;
            if (data.blockDM && newMessage.channel.isDMBased()) return newMessage.reply({ content: client.configs.defaults.dmDisabled });
            else if (data.channelLimits && !data.channelLimits.includes(newMessage.channel.type)) return newMessage.reply({ content: client.configs.defaults.invalidChannelType });
            else if (data.requiredPerm && newMessage.guild && !newMessage.member!.permissions.has(data.requiredPerm)) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedRoles && !newMessage.member!.roles.cache.some(role => data.allowedRoles!.includes(role.id))) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedUsers && !data.allowedUsers.includes(newMessage.author.id)) return newMessage.reply({ content: client.configs.defaults.noPerms });
            else if (data.disabled) return newMessage.reply({ content: client.configs.defaults.disabled });
            else return data.executors.get('text')(client, newMessage);
        }
        // Do stuff here
    },
} as EventExport;