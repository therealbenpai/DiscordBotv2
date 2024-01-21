import * as Discord from 'discord.js';
import fs from 'fs';
import { Routes } from 'discord-api-types/v10';
import chalk from 'chalk';
import os from 'os'
import { config } from 'dotenv';
config({ path: `${__dirname}/.env` });

//- Internal Functions
import Utils from './functions/massClass';
import Components from './components/collection';
import Triggers from './triggers/collection';
import Commands from './commands/collection';
import Events from './events/collection';

import { CommandSlashExecute, CommandMessageExecute, CommandAutocomplete, ClientInterface, CommandExport, EventExport, TriggerExport, ComponentsType, ExecutorsInterface, RuntimeStatsInterface, RTSCounterInterface, ButtonExport, ContextMenuExport, ModalExport, SelectMenuExport } from './types';

//- Constants
const baseDir = __dirname;
const {
    TOKEN: token,
    PREFIX: prefix,
    CLIENT_ID: clientID,
} = process.env;

class Executors implements ExecutorsInterface{
    slash: CommandSlashExecute;
    text: CommandMessageExecute;
    autocomplete: CommandAutocomplete;
    constructor() {
        this.autocomplete = async (client: ClientInterface, interaction: Discord.AutocompleteInteraction) => { };
        this.text = async (client: ClientInterface, message: Discord.Message) => { };
        this.slash = async (client: ClientInterface, interaction: Discord.ChatInputCommandInteraction) => { };
    }
    get(key: 'slash'): CommandSlashExecute;
    get(key: 'text'): CommandMessageExecute;
    get(key: 'autocomplete'): CommandAutocomplete;
    get(key: 'slash' | 'text' | 'autocomplete') {
        switch (key) {
            case 'slash':
                return this.slash;
            case 'text':
                return this.text;
            case 'autocomplete':
                return this.autocomplete;
        }
    }
    set(key: 'slash' | 'text' | 'autocomplete', value: CommandSlashExecute | CommandMessageExecute | CommandAutocomplete) {
        switch (key) {
            case 'slash':
                this.slash = value as CommandSlashExecute;
                break;
            case 'text':
                this.text = value as CommandMessageExecute;
                break;
            case 'autocomplete':
                this.autocomplete = value as CommandAutocomplete;
                break;
        }
        return this;
    }
}

class RTSCounter implements RTSCounterInterface{
    public triggerMaps: Map<string, number>;
    constructor(miscExecuted?: Array<string>) {
        this.triggerMaps = new Map();
        this.triggerMaps.set('registered', 0);
        this.triggerMaps.set('executed', 0);
        for (const v of miscExecuted ?? []) {
            this.triggerMaps.set(`${v}Executed`, 0);
        }
    }
    bump(key: string) {
        if (!this.triggerMaps.has(key)) throw new TypeError(`Invalid key: ${key}`);
        this.triggerMaps.set(key, this.triggerMaps.get(key)! + 1);
    }
    retrieve(key: string) {
        if (!this.triggerMaps.has(key)) throw new TypeError(`Invalid key: ${key}`);
        return this.triggerMaps.get(key)!;
    }
}

//- Component Collections
const buttons = new Discord.Collection() as Discord.Collection<string, ButtonExport>;
const selectMenus = new Discord.Collection() as Discord.Collection<string, SelectMenuExport>;
const contextMenus = new Discord.Collection() as Discord.Collection<string, ContextMenuExport>;
const modals = new Discord.Collection() as Discord.Collection<string, ModalExport>;

//- Base Collections
const commands = new Discord.Collection() as Discord.Collection<string, CommandExport>;
const events = new Discord.Collection() as Discord.Collection<string, EventExport>;
const components = new Discord.Collection() as Discord.Collection<string, Discord.Collection<string, ComponentsType>>;
const triggers = new Discord.Collection() as Discord.Collection<string, TriggerExport>;

class Client extends Discord.Client implements ClientInterface {
    runtimeStats: RuntimeStatsInterface;
    configs: { prefix: string; defaults: { disabled: string; noPerms: string; dmDisabled: string; invalidChannelType: string; }; };
    baseDir: string;
    Utils: typeof Utils;
    Commands: Discord.Collection<string, CommandExport>;
    Events: Discord.Collection<string, EventExport>;
    Components: Discord.Collection<string, Discord.Collection<string, ComponentsType>>;
    Triggers: Discord.Collection<string, TriggerExport>;
    constructor() {
        super({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.GuildModeration,
                Discord.GatewayIntentBits.GuildEmojisAndStickers,
                Discord.GatewayIntentBits.GuildIntegrations,
                Discord.GatewayIntentBits.GuildWebhooks,
                Discord.GatewayIntentBits.GuildInvites,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.GuildPresences,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.GuildMessageReactions,
                Discord.GatewayIntentBits.GuildMessageTyping,
                Discord.GatewayIntentBits.DirectMessages,
                Discord.GatewayIntentBits.DirectMessageReactions,
                Discord.GatewayIntentBits.DirectMessageTyping,
                Discord.GatewayIntentBits.MessageContent
            ],
            partials: [
                Discord.Partials.Channel,
                Discord.Partials.GuildMember,
                Discord.Partials.Message,
                Discord.Partials.Reaction,
                Discord.Partials.User,
                Discord.Partials.ThreadMember
            ],
            presence: {
                activities: [
                    {
                        type: Discord.ActivityType.Watching,
                        name: 'with Astolfo and other cute boys'
                    }
                ],
                status: Discord.PresenceUpdateStatus.DoNotDisturb,
            }
        })
        this.runtimeStats = {
            commands: new RTSCounter(['text', 'slash']),
            triggers: new RTSCounter(['channel', 'role', 'user', 'message']),
            events: {
                registered: 0,
                executed: 0,
                singularEventExecutions: {}
            },
            components: {
                buttons: new RTSCounter(),
                selectMenus: new RTSCounter(),
                contextMenus: new RTSCounter(),
                modals: new RTSCounter(),
            },
        }
        this.configs = {
            prefix: prefix ?? '',
            defaults: {
                disabled: 'This command is currently disabled',
                noPerms: 'You do not have permission to use this command.',
                dmDisabled: 'This command is disabled in DMs.',
                invalidChannelType: 'This command cannot be used in this channel type.',
            },
        }
        this.baseDir = baseDir
        this.Utils = Utils
        this.Commands = commands
        this.Events = events
        this.Components = components
        this.Triggers = triggers
    }
    bumpEvent = (evName: string) => {
        // @ts-ignore
        if (!this.runtimeStats.events.singularEventExecutions[evName]) this.runtimeStats.events.singularEventExecutions[evName] = 0;
        // @ts-ignore
        this.runtimeStats.events.singularEventExecutions[evName]++;
        this.runtimeStats.events.executed++;
    }
    embed = () => new Discord.EmbedBuilder({ footer: { text: 'Filler Text' }, color: 0x2F3136 }).setTimestamp()
    stats = () => {
        const stats = {
            ping: this.ws.ping,
            uptime: this.Utils.Formatter.list(String(this.Utils.Time.elapsedTime(Math.floor(process.uptime()))).split(', ')),
            guilds: this.guilds.cache.size.toString(),
            ram: {
                botOnly: {
                    rawValue: parseFloat((process.memoryUsage().heapTotal / (1024 ** 2)).toFixed(2)),
                    percentage: parseFloat(((process.memoryUsage().heapTotal / os.totalmem()) * 100).toFixed(2)),
                    unit: 'MB'
                },
                global: {
                    rawValue: parseFloat(((os.totalmem() - os.freemem()) / (1024 ** 2)).toFixed(2)),
                    percentage: parseFloat((((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)),
                    unit: 'MB'
                }
            }
        }
        if (stats.ram.botOnly.rawValue > 1024) {
            stats.ram.botOnly.rawValue = parseFloat((stats.ram.botOnly.rawValue / 1024).toFixed(2));
            stats.ram.botOnly.unit = 'GB';
        }
        if (stats.ram.global.rawValue > 1024) {
            stats.ram.global.rawValue = parseFloat((stats.ram.global.rawValue / 1024).toFixed(2));
            stats.ram.global.unit = 'GB';
        }

        return stats;
    }
}

const client = new Client();

for (const event of Object.values(Events)) {
    console.log(chalk`{bold Loaded event} {green ${event.name}}`);
    events.set(event.name, event);
    client.runtimeStats.events.registered++;
    client.on(event.name, (...args) => event.execute(client, ...args));
}

const interactions: Array<Discord.ContextMenuCommandBuilder | Discord.SlashCommandBuilder> = [];

for (const command of Object.values(Commands) as Array<CommandExport>) {
    if (command.type.slash === false) continue;
    console.log(chalk`{bold Loaded command} {blue ${command.name}}`);
    commands.set(command.name, command);
    client.runtimeStats.commands.bump('registered');
    interactions.push(command.data);
}

for (const contextMenu of Object.values(Components.ContextMenus as { [key: string]: ContextMenuExport })) {
    console.log(chalk`{bold Loaded contextMenu} {red ${contextMenu.name}}`);
    client.runtimeStats.components.contextMenus.bump('registered');
    interactions.push(contextMenu.data);
    contextMenus.set(contextMenu.name, contextMenu);
}

for (const button of Object.values(Components.Buttons as { [key: string]: ButtonExport })) {
    console.log(chalk`{bold Loaded button} {red ${button.name}}`);
    client.runtimeStats.components.buttons.bump('registered');
    buttons.set(button.name, button);
}

for (const selectMenu of Object.values(Components.SelectMenus as { [key: string]: SelectMenuExport })) {
    console.log(chalk`{bold Loaded selectMenu} {red ${selectMenu.name}}`);
    client.runtimeStats.components.selectMenus.bump('registered');
    selectMenus.set(selectMenu.name, selectMenu);
}

for (const modal of Object.values(Components.Modals as { [key: string]: ModalExport })) {
    console.log(chalk`{bold Loaded modal} {red ${modal.name}}`);
    client.runtimeStats.components.modals.bump('registered');
    modals.set(modal.name, modal);
}

for (const trigger of Object.values(Triggers) as Array<TriggerExport>) {
    console.log(chalk`{bold Loaded trigger} {red ${trigger.name}}`);
    client.runtimeStats.triggers.bump('registered');
    triggers.set(trigger.name, trigger);
}

fs.readdirSync(`${__dirname}/triggers`)
    .filter(file => file.endsWith('.js') && file !== 'example.e.js')
    .forEach(file => {
        const trigger = require(`${__dirname}/triggers/${file}`).default;
        console.log(chalk`{bold Loaded trigger} {red ${trigger.name}}`);
        client.runtimeStats.triggers.bump('registered');
        triggers.set(trigger.name, trigger);
    });

components.set('buttons', buttons);
components.set('selectMenus', selectMenus);
components.set('contextMenus', contextMenus);
components.set('modals', modals);

new Discord.REST({ version: '10' })
    .setToken(String(token))
    .put(Routes.applicationCommands(String(clientID)), { body: interactions.map(i => i.toJSON()) })
    .then(() => console.log(chalk.green`Successfully registered application commands.`))
    .catch(console.error);

client.login(token);

export default client;
export { Executors, Client, RTSCounter }