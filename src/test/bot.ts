import { Message } from 'discord.js' // Import the "Message" class from the discord.js library. (not required for JS)
import Bot, { EZEmbed } from '../index' // Import the bot constrcutor and the EZEmbed class from the EZBot library.
import config from './config.json' // Import the config file.

new Bot(config.token, config.botName, config.clientID) // Create a new bot with the provided token, name, and client ID.
.onready(() => console.log('Bot is ready!')) // When the bot is ready, log "Bot is ready!"
.loadDefault() // Load the default commands.
.addCommand('hello', (m: Message) => m.reply('Hello!')) // EXAMPLE: Add a command called "hello" which replies "Hello!"
.addCommand('embed', (m: Message) => m.reply({ embeds: [ new EZEmbed({
    title: 'Embed Title',
    description: 'Embed Description',
    color: 'BLUE',
    author: m.author.tag,
    authorIcon: m.author.displayAvatarURL({ dynamic: true }),
})] })) // EXAMPLE: Add a command called "embed" which replies with an "EZEmbed".