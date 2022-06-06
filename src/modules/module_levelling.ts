import { Client, Message } from "discord.js"
import mongoose from 'mongoose'
import { EZEmbed } from ".."

interface ILevellingProfile {
    userID: string
    guildID?: string
    xp: number
    level: number
    rank: number
    xpToNextLevel: number
    lastXP: Date
}

const levellingSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    rank: Number,
    xpToNextLevel: Number,
    lastXP: Date
})

const levelling = mongoose.model<ILevellingProfile>('Levelling', levellingSchema)

export default function levellingModule(client: Client, mongouri: string, options: { guildOnly: boolean, levelRequirementMultiplier: number, xpRefershTime: number, xpGainRate: number }) {
    mongoose.connect(mongouri)
    client.on('messageCreate', async (message: Message) => {
        const min = options.xpGainRate * 0.8
        const max = options.xpGainRate * 1.2
        const xpGain = Math.floor(Math.random() * (max - min) + min)

        if(options.guildOnly) {
            const user = await levelling.findOne({ userID: message.author.id, guildID: message.guild?.id })
            if(!user) await levelling.create({
                userID: message.author.id,
                guildID: message.guild?.id,
                xp: 0, level: 0,
                xpToNextLevel: 100,
                lastXP: new Date()
            })

            if(user && user.lastXP.getTime() + options.xpRefershTime < Date.now()) {
                user.xp += xpGain
                user.lastXP = new Date()
                if(user.xpToNextLevel > xpGain) user.xpToNextLevel -= xpGain
                else { 
                    user.xpToNextLevel += user.level * 100 * options.levelRequirementMultiplier
                    user.level++
                    user.xp = 0

                    message.reply({ embeds: [new EZEmbed({
                        title: 'Level Up!',
                        description: `You have reached level ${user.level}!`,
                        color: 'BLUE',
                        author: message.author.tag,
                        authorIcon: message.author.displayAvatarURL({ dynamic: true })
                    })] })
                }
                user.save()
            } else return
        }
    })

    console.log('Added module:', '\x1b[32mdef_levelling\x1b[0m')
}