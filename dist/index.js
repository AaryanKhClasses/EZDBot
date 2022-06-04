"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Bot_instances, _Bot_prefix, _Bot_commands, _Bot_pingCommand, _Bot_helpCommand;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EZEmbed = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const client = new discord_js_1.default.Client({ intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS'] });
class Bot {
    /**
     * @param {string} token The bot token required to login to the bot and make the bot usable.
     * @param {string} name The name of the bot shown in embeds and while using commands.
     * @param {string} clientID The client ID of the bot.
     * @param {string} prefix The prefix of the bot used to call out commands. (default '!')
    */
    constructor(token, name, clientID, prefix = '!') {
        _Bot_instances.add(this);
        _Bot_prefix.set(this, void 0);
        _Bot_commands.set(this, void 0);
        __classPrivateFieldSet(this, _Bot_prefix, prefix, "f");
        __classPrivateFieldSet(this, _Bot_commands, [], "f");
        client.login(token).catch((err) => console.log('\x1b[31m%s\x1b[0m', new EZError('Invalid / No Bot Token is provided!')));
    }
    /**
     * @param {Function} cb The callback function to be called when the bot is ready.
    */
    onready(cb) {
        client.on('ready', () => cb());
        return this;
    }
    /**
     * The default commands to be loaded into the bot (i.e., ping, help)
    */
    loadDefault() {
        this.addCommand('ping', (message) => __classPrivateFieldGet(this, _Bot_instances, "m", _Bot_pingCommand).call(this, message), 'Pings the bot!', ['pong']);
        this.addCommand('help', (message) => __classPrivateFieldGet(this, _Bot_instances, "m", _Bot_helpCommand).call(this, message), 'Shows the list of commands!', ['commands']);
        return this;
    }
    /**
     *
     * @param {string} name The name of the command to be added.
     * @param {Function} cb The callback function to be called when the command is called.
     * @param {string} description The description of the command shown when using the command.
     * @param {string[]} aliases Extra command names which can be called instead of the main name.
     */
    addCommand(name, cb, description = 'No Description', aliases = []) {
        console.log(`Added command:`, `\x1b[32m${name}\x1b[0m`);
        __classPrivateFieldGet(this, _Bot_commands, "f").push({ name, cb, description, aliases });
        client.on('messageCreate', (message) => {
            const command = message.content.split(' ')[0].toLowerCase();
            if (!message.content.startsWith(__classPrivateFieldGet(this, _Bot_prefix, "f")))
                return;
            if (command.startsWith(`${__classPrivateFieldGet(this, _Bot_prefix, "f")}${name}`)
                || aliases.some(alias => alias.toLowerCase().startsWith(`${name}`)))
                cb(message, client);
        });
        return this;
    }
}
exports.default = Bot;
_Bot_prefix = new WeakMap(), _Bot_commands = new WeakMap(), _Bot_instances = new WeakSet(), _Bot_pingCommand = function _Bot_pingCommand(message) {
    message.reply({ embeds: [new EZEmbed({
                description: 'Pong!',
                color: 'BLUE',
                author: message.author.tag,
                authorIcon: message.author.displayAvatarURL({ dynamic: true }),
            })] }).then(newMessage => {
        const ping = newMessage.createdTimestamp - message.createdTimestamp;
        newMessage.edit({ embeds: [new EZEmbed({
                    description: `Pong: \`${ping}ms\``,
                    color: 'BLUE',
                    author: message.author.tag,
                    authorIcon: message.author.displayAvatarURL({ dynamic: true }),
                })] });
    });
}, _Bot_helpCommand = function _Bot_helpCommand(message) {
    const fieldArray = __classPrivateFieldGet(this, _Bot_commands, "f").map(command => {
        return {
            name: `**${command.name}**`,
            value: command.description,
        };
    });
    message.reply({ embeds: [new EZEmbed({
                title: 'Help Command',
                description: 'Here are the list of commands you can use:',
                fields: fieldArray,
                color: 'BLUE',
                author: message.author.tag,
                authorIcon: message.author.displayAvatarURL({ dynamic: true }),
            })] });
};
class EZEmbed {
    constructor({ title = '', description = '', color = '#000000', fields = [], footer = '', footerIcon = '', thumbnail = '', image = '', author = '', authorIcon = '', timestamp = new Date() }) {
        return new discord_js_1.default.MessageEmbed()
            .setAuthor({ name: author, iconURL: authorIcon })
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({ text: footer !== '' ? footer + ' | Made using EZDBot!' : 'Made using EZDBot!', iconURL: footerIcon })
            .setTimestamp(timestamp)
            .setThumbnail(thumbnail)
            .setImage(image)
            .addFields(fields);
    }
}
exports.EZEmbed = EZEmbed;
class EZError extends Error {
    constructor(err) {
        super(err);
    }
}
