import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { slashCommandBuilder, baseURL } from "../../../Events/functions.js";
import { fetchRandom } from "nekos-best.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";
let animeGif = ["baka", "bite", "blush", "bored", "cry", "cuddle", "dance", "facepalm", "feed", "handhold", "happy", "highfive", "hug", "kick", "kiss", "laugh", "nod", "nom", "nope", "pat", "poke", "pout", "punch", "shoot", "shrug"];
let animeGif2 = ["slap", "sleep", "smile", "smug", "stare", "think", "thumbsup", "tickle", "wave", "wink", "yeet"];
// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
    name: path.parse(fileURLToPath(import.meta.url)).name, // Tên lệnh 
    description: "Xem hình ảnh theo yêu cầu", // Mô tả lệnh
    userPerms: [], // quyền của thành viên có thể sử dụng lệnh
    owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
    cooldown: 3, // thời gian hồi lệnh
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "anime",
            description: "Xem gif anime dễ thương theo yêu cầu",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "bạn muốn xem gì",
                    type: ApplicationCommandOptionType.String,
                    choices: animeGif.map((animal) => ({ name: animal, value: animal })),
                }, {
                    name: "name2",
                    description: "bạn muốn xem gì",
                    type: ApplicationCommandOptionType.String,
                    choices: animeGif2.map((animal) => ({ name: animal, value: animal })),
                }
            ],
        }
    ],
}).addSlashCommand(async (client, interaction) => {
    if (interaction.options.getSubcommand() === "anime") {
        const choice = interaction.options.getString("name");
        const choice2 = interaction.options.getString("name2");
        const response = await fetchRandom(choice || choice2);
        return interaction.reply({ content: response.results[0].url });
    };
});
// console.log(slashCommand.toJSON());
export default slashCommand;