"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const __1 = require("..");
const levellingSchema = new mongoose_1.default.Schema({
    userID: String,
    guildID: String,
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    rank: Number,
    xpToNextLevel: Number,
    lastXP: Date
});
const levelling = mongoose_1.default.model('Levelling', levellingSchema);
function levellingModule(client, mongouri, options) {
    mongoose_1.default.connect(mongouri);
    client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const min = options.xpGainRate * 0.8;
        const max = options.xpGainRate * 1.2;
        const xpGain = Math.floor(Math.random() * (max - min) + min);
        if (options.guildOnly) {
            const user = yield levelling.findOne({ userID: message.author.id, guildID: (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id });
            if (!user)
                yield levelling.create({
                    userID: message.author.id,
                    guildID: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id,
                    xp: 0, level: 0,
                    xpToNextLevel: 100,
                    lastXP: new Date()
                });
            if (user && user.lastXP.getTime() + options.xpRefershTime < Date.now()) {
                user.xp += xpGain;
                user.lastXP = new Date();
                if (user.xpToNextLevel > xpGain)
                    user.xpToNextLevel -= xpGain;
                else {
                    user.xpToNextLevel += user.level * 100 * options.levelRequirementMultiplier;
                    user.level++;
                    user.xp = 0;
                    message.reply({ embeds: [new __1.EZEmbed({
                                title: 'Level Up!',
                                description: `You have reached level ${user.level}!`,
                                color: 'BLUE',
                                author: message.author.tag,
                                authorIcon: message.author.displayAvatarURL({ dynamic: true })
                            })] });
                }
                user.save();
            }
            else
                return;
        }
    }));
    console.log('Added module:', '\x1b[32mdef_levelling\x1b[0m');
}
exports.default = levellingModule;
