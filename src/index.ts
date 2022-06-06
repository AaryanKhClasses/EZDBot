import Discord, { ColorResolvable, EmbedFieldData, Message } from 'discord.js'
const client: Discord.Client = new Discord.Client({ intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_BANS', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS'] })

type defModules = 'def_levelling' | 'def_test'
import levellingModule from './modules/module_levelling'

export default class Bot {
    #prefix: string
    #commands: { name: string, cb: Function, description?: string, aliases?: string[] }[]
    /**
     * @param {string} token The bot token required to login to the bot and make the bot usable.
     * @param {string} name The name of the bot shown in embeds and while using commands.
     * @param {string} clientID The client ID of the bot.
     * @param {string} prefix The prefix of the bot used to call out commands. (default '!')
    */
    constructor(token: string, name: string, clientID: string, prefix: string = '!') {
        this.#prefix = prefix
        this.#commands = []
        client.login(token).catch((err: string) => console.log('\x1b[31m%s\x1b[0m', new EZError('Invalid / No Bot Token is provided!')))
    }

    /**
     * @param {Function} cb The callback function to be called when the bot is ready.
    */
    onready(cb: Function) { 
        client.on('ready', () => cb())
        return this
    }

    /**
     * The default commands to be loaded into the bot (i.e., ping, help)
    */
    loadDefault() {
        this.addCommand('ping', (message: Message) => this.#pingCommand(message), 'Pings the bot!', ['pong'])
        this.addCommand('help', (message: Message) => this.#helpCommand(message), 'Shows the list of commands!', ['commands'])
        return this
    }

    /**
     * @param module The module to be loaded. (Default: 'def_levelling')
     * @param mongouri The URI of the MongoDB database.
     */
    loadModule(module: defModules | string, mongouri: string) {
        if(module === 'def_levelling') levellingModule(client, mongouri, { guildOnly: true, levelRequirementMultiplier: 1.5, xpRefershTime: 60000, xpGainRate: 25 })
    }
    
    /**
     * 
     * @param {string} name The name of the command to be added.
     * @param {Function} cb The callback function to be called when the command is called.
     * @param {string} description The description of the command shown when using the command.
     * @param {string[]} aliases Extra command names which can be called instead of the main name.
     */
    addCommand(name: string, cb: Function, description: string = 'No Description', aliases: string[] = []) {
        console.log(`Added command:`, `\x1b[32m${name}\x1b[0m`,)
        this.#commands.push({ name, cb, description, aliases })
        
        client.on('messageCreate', (message: Message) => {
            const command = message.content.split(' ')[0].toLowerCase()
            if(!message.content.startsWith(this.#prefix)) return
            if(command.startsWith(`${this.#prefix}${name}`)
            || aliases.some(alias => alias.toLowerCase().startsWith(`${name}`))) cb(message, client)
        })
        return this
    }

    #pingCommand(message: Message) {
        message.reply({ embeds: [new EZEmbed({
            description: 'Pong!',
            color: 'BLUE',
            author: message.author.tag,
            authorIcon: message.author.displayAvatarURL({ dynamic: true }),
        })] }).then(newMessage => {
            const ping = newMessage.createdTimestamp - message.createdTimestamp
            newMessage.edit({ embeds: [new EZEmbed({
                description: `Pong: \`${ping}ms\``,
                color: 'BLUE',
                author: message.author.tag,
                authorIcon: message.author.displayAvatarURL({ dynamic: true }),
            })] })
        })
    }

    #helpCommand(message: Message) {
        const fieldArray = this.#commands.map(command => {
            return {
                name: `**${command.name}**` as string,
                value: command.description as string,
            }
        })

        message.reply({ embeds: [new EZEmbed({
            title: 'Help Command',
            description: 'Here are the list of commands you can use:',
            fields: fieldArray,
            color: 'BLUE',
            author: message.author.tag,
            authorIcon: message.author.displayAvatarURL({ dynamic: true }),
        })] })
    }
}

export class EZEmbed {
    constructor({ title = '', description = '', color = '#000000', fields = [], footer = '', footerIcon = '', thumbnail = '', image = '', author = '', authorIcon = '', timestamp = new Date() }: { title?: string, description?: string, color?: ColorResolvable, fields?: EmbedFieldData[], footer?: string, footerIcon?: string, thumbnail?: string, image?: string, author?: string, authorIcon?: string, timestamp?: number | Date | null | undefined }) { 
        return new Discord.MessageEmbed()
        .setAuthor({ name: author, iconURL: authorIcon })
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({ text: footer !== '' ? footer + ' | Made using EZDBot!' : 'Made using EZDBot!', iconURL: footerIcon })
        .setTimestamp(timestamp)
        .setThumbnail(thumbnail)
        .setImage(image)
        .addFields(fields)
    }
}

class EZError extends Error {
    constructor(err: string) {
        super(err)
    }
}