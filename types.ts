import * as Discord from 'discord.js';
import Utils from './functions/massClass';

type CommandSlashExecute = (client: ClientInterface, interaction: Discord.ChatInputCommandInteraction) => Promise<any>;
type CommandMessageExecute = (client: ClientInterface, message: Discord.Message) => Promise<any>;
type CommandAutocomplete = (client: ClientInterface, interaction: Discord.AutocompleteInteraction) => Promise<any>;

interface ExecutorsInterface {
    slash: CommandSlashExecute
    text: CommandMessageExecute
    autocomplete: CommandAutocomplete
    get(key: 'slash'): CommandSlashExecute
    get(key: 'text'): CommandMessageExecute
    get(key: 'autocomplete'): CommandAutocomplete
    set(key: 'slash', value: CommandSlashExecute): this
    set(key: 'text', value: CommandMessageExecute): this
    set(key: 'autocomplete', value: CommandAutocomplete): this
}

interface RTSCounterInterface {
    triggerMaps: Map<string, number>
    bump: (key: string) => void
    retrieve: (key: string) => number
}

interface RuntimeStatsInterface {
    commands: RTSCounterInterface,
    triggers: RTSCounterInterface,
    events: {
        registered: number
        executed: number
        singularEventExecutions: {
            [key: string]: number
        }
    }
    components: {
        buttons: RTSCounterInterface
        selectMenus: RTSCounterInterface
        contextMenus: RTSCounterInterface
        modals: RTSCounterInterface
    }
}

interface ClientInterface extends Discord.Client {
    runtimeStats: RuntimeStatsInterface
    bumpEvent: (evName: string) => void
    stats: () => {
        ping: number
        uptime: string
        guilds: string
        ram: {
            botOnly: {
                rawValue: number
                percentage: number
                unit: string
            }
            global: {
                rawValue: number
                percentage: number
                unit: string
            }
        }
    }
    configs: {
        prefix: string
        defaults: {
            disabled: string
            noPerms: string
            dmDisabled: string
            invalidChannelType: string
        }
    }
    baseDir: string
    Utils: typeof Utils
    embed: () => Discord.EmbedBuilder
    Commands: Discord.Collection<string, CommandExport>
    Events: Discord.Collection<string, EventExport>
    Components: Discord.Collection<string, Discord.Collection<string, ComponentsType>>
    Triggers: Discord.Collection<string, TriggerExport>

}
interface ButtonExport {
    name: string
    info: {
        name: string
        description: string
    }
    data: Discord.ButtonBuilder
    execute(client: ClientInterface, interaction: Discord.ButtonInteraction): Promise<any>
}
interface ContextMenuExport {
    name: string
    info: {
        name: 'NAME',
        description: 'DESCRIPTION',
    },
    data: Discord.ContextMenuCommandBuilder
    execute(client: ClientInterface, interaction: Discord.ContextMenuCommandInteraction): Promise<any>
}
interface ModalExport {
    name: string
    info: {
        name: string
        description: string
    }
    data: Discord.ModalBuilder
    execute(client: ClientInterface, interaction: Discord.ModalSubmitInteraction): Promise<any>
}
interface SelectMenuExport {
    name: string
    info: {
        name: string
        description: string
    }
    data: Discord.SelectMenuBuilder
    execute(client: ClientInterface, interaction: Discord.SelectMenuInteraction): Promise<any>
}
interface CommandExport {
    name: string
    triggers: Array<string>
    info: {
        type: string
        name: string
        description: string
        usage: string
        examples: Array<string>
        permissions?: Array<string>
        aliases: Array<string>
    }
    requiredPerm?: Discord.PermissionResolvable
    channelLimits?: Array<Discord.ChannelType>
    allowedRoles?: Array<string>
    allowedUsers?: Array<string>
    blockDM: boolean
    type: {
        slash: boolean
        text: boolean
    }
    disabled: boolean
    data: Discord.SlashCommandBuilder
    executors: ExecutorsInterface
}
interface EventExport {
    name: string,
    once: boolean,
    execute: (client: ClientInterface, ...args: any) => Promise<any>,
}
interface TriggerExport {
    name: string
    globalDisable: boolean
    triggerCfgs: {
        channel: {
            activated: boolean
            requirePrefix: boolean
            ids?: Array<string>
            types?: Array<Discord.ChannelType>
        }
        role: {
            activated: boolean
            requirePrefix: boolean
            ids?: Array<string>
        }
        user: {
            activated: boolean
            requirePrefix: boolean
            ids?: Array<string>
        }
        message: {
            activated: boolean
            requirePrefix: boolean
            prefixes?: Array<string>
            contains?: Array<string>
            suffixes?: Array<string>
            regex?: Array<RegExp>
        }
    },
    execute(client: ClientInterface, message: Discord.Message): Promise<any>
}

type ComponentsType = ButtonExport | SelectMenuExport | ContextMenuExport | ModalExport;

export type {
    CommandSlashExecute,
    CommandMessageExecute,
    CommandAutocomplete,
    ClientInterface,
    CommandExport,
    EventExport,
    TriggerExport,
    ComponentsType,
    ExecutorsInterface,
    RuntimeStatsInterface,
    RTSCounterInterface,
    ButtonExport,
    ContextMenuExport,
    ModalExport,
    SelectMenuExport,
}