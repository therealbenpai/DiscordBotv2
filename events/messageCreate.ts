import { Events, Message } from 'discord.js';
import { EventExport, ClientInterface, CommandExport } from '../types';
import fs from 'fs'

export default {
    name: Events.MessageCreate,
    once: false,
    async execute(client: ClientInterface, message: Message) {
        client.bumpEvent(Events.MessageCreate);
        if (message.author.bot || message.partial) return;

        Array.from(client.Triggers.entries())
            .filter(([key, trigger]) => trigger.globalDisable === false)
            .forEach(([key, trigger]) => {
                if (trigger.triggerCfgs.channel.activated) {
                    if (trigger.triggerCfgs.channel.ids!.length > 0 && trigger.triggerCfgs.channel.ids!.includes(message.channel.id)) {
                        if (!trigger.triggerCfgs.channel.requirePrefix || (trigger.triggerCfgs.channel.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('channelExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                    if (trigger.triggerCfgs.channel.types!.length > 0 && trigger.triggerCfgs.channel.types!.includes(message.channel.type)) {
                        if (!trigger.triggerCfgs.channel.requirePrefix || (trigger.triggerCfgs.channel.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('channelExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                }
                if (trigger.triggerCfgs.role.activated) {
                    if (trigger.triggerCfgs.role.ids!.length > 0 && message.member!.roles.cache.some(role => trigger.triggerCfgs.role.ids!.includes(role.id))) {
                        if (!trigger.triggerCfgs.role.requirePrefix || (trigger.triggerCfgs.role.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('roleExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                }
                if (trigger.triggerCfgs.user.activated) {
                    if (trigger.triggerCfgs.user.ids!.length > 0 && trigger.triggerCfgs.user.ids!.includes(message.author.id)) {
                        if (!trigger.triggerCfgs.user.requirePrefix || (trigger.triggerCfgs.user.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('userExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                }
                if (trigger.triggerCfgs.message.activated) {
                    if (trigger.triggerCfgs.message.prefixes!.length > 0 && trigger.triggerCfgs.message.prefixes!.some(prefix => message.content.toLowerCase().startsWith(prefix.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('messageExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                    if (trigger.triggerCfgs.message.contains!.length > 0 && trigger.triggerCfgs.message.contains!.some(contains => message.content.toLowerCase().includes(contains.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('messageExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                    if (trigger.triggerCfgs.message.suffixes!.length > 0 && trigger.triggerCfgs.message.suffixes!.some(suffix => message.content.toLowerCase().endsWith(suffix.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('messageExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                    if (trigger.triggerCfgs.message.regex!.length > 0 && trigger.triggerCfgs.message.regex!.some(regex => regex.test(message.content.toLowerCase()))) {
                        if (!trigger.triggerCfgs.message.requirePrefix || (trigger.triggerCfgs.message.requirePrefix && message.content.startsWith(client.configs.prefix))) {
                            client.runtimeStats.triggers.bump('messageExecuted');
                            return trigger.execute(client, message)
                        }
                    }
                }
            })

        if (message.content.startsWith(client.configs.prefix)) {
            const commandBase = message.content.split(' ')[0].slice(client.configs.prefix.length).toLowerCase();
            const data = client.Commands.get(commandBase);
            if (!data || !data.type.text) return;
            client.runtimeStats.commands.bump('textExecuted');
            if (data.blockDM && message.channel.isDMBased()) return message.reply({ content: client.configs.defaults.dmDisabled });
            else if (data.channelLimits && !data.channelLimits.includes(message.channel.type)) return message.reply({ content: client.configs.defaults.invalidChannelType });
            else if (data.requiredPerm && message.guild && !message.member!.permissions.has(data.requiredPerm)) return message.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedRoles && !message.member!.roles.cache.some(role => data.allowedRoles!.includes(role.id))) return message.reply({ content: client.configs.defaults.noPerms });
            else if (data.allowedUsers && !data.allowedUsers.includes(message.author.id)) return message.reply({ content: client.configs.defaults.noPerms });
            else if (data.disabled) return message.reply({ content: client.configs.defaults.disabled });
            else return data.executors.get('text')(client, message);
        }
    }
} as EventExport;