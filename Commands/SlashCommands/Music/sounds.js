import { AudioPlayerStatus, joinVoiceChannel, createAudioResource, createAudioPlayer } from "@discordjs/voice";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { slashCommandBuilder } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";
// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
    name: path.parse(fileURLToPath(import.meta.url)).name, // Tên lệnh, có thể viết hoa hoặc chữ thường theo sở thích
    description: "các lệnh liên quan đến kênh voice", // Mô tả lệnh
    userPerms: [], // quyền của thành viên có thể sử dụng lệnh
    owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
    cooldown: 3, // thời gian hồi lệnh
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "sounds",
            description: "Nghe các đoạn voice meme nổi tiếng",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "tên_sound",
                description: "Lựa chọn tên của sounds bạn muốn nghe",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: "70 tuổi", value: "70tuoi" },
                    { name: "Fbi open up", value: "fbi" },
                    { name: "Yeet", value: "yeet" },
                    { name: "Nhạc khiêng hòm", value: "dancememe" },
                ],
            }],
        }, {
            name: "create",
            description: "Tạo kênh channel voice",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
}).addSlashCommand((client, interaction) => {
    if(interaction.options.getSubcommand() === "sounds") {
        const toggle = interaction.options.getString("tên_sound");
        let response;
        if (toggle === "70tuoi") {
            PlaySound(interaction, `${process.cwd()}/Events/Assets/Sounds/70tuoi.mp3`);
            response = "đang chạy sounds 70 tuổi";
        } else if (toggle === "fbi") {
            PlaySound(interaction, "https://www.myinstants.com/media/sounds/fbi-open-up-sfx.mp3");
            response = "Đang phát fbi open up";
        } else if (toggle === "dancememe") {
            PlaySound(interaction, "https://www.myinstants.com/media/sounds/y2mate-mp3cut_sRzY6rh.mp3");
            response = "Đang phát nhạc khiêng hòm"
        } else if (toggle === "yeet") {
            PlaySound(interaction, "https://www.myinstants.com/media/sounds/yeet.mp3");
            response = "Đang phát Yeet";
        };
        interaction.reply({ content: `🔊 ${response}` });
    } else if (interaction.options.getSubcommand() === "create") {
        interaction.reply({ content: "test create" });
    };
});

function PlaySound(interaction, url) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content: "Bạn chưa tham gia kênh voice channel" });
    const player = createAudioPlayer();
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    player.play(createAudioResource(url));
    connection.subscribe(player);
    player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
    });
};
// console.log(slashCommand.toJSON());
export default slashCommand;