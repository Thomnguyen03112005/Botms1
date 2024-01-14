import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { music as musicDb, welcomeGoodbye, channelSchema } from "../../../Events/Assets/Schemas/databases.js";
import { musicEmbedDefault } from "../../../Handlers/DistubeEvents.js";
import { slashCommandBuilder } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
    name: path.parse(fileURLToPath(import.meta.url)).name, // Tên lệnh 
    description: "Thiết lập channel cho một số lệnh mặc định như welcome ...", // Mô tả lệnh
    userPerms: ["Administrator"], // quyền của thành viên có thể sử dụng lệnh
    owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
    cooldown: 3, // thời gian hồi lệnh
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "options",
            description: "Chọn thể loại bạn muốn thiết lập cho guilds",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "welcome", value: "welcome" },
                { name: "goodbye", value: "goodbye" },
                { name: "auto-music", value: "music" },
                { name: "create-voice", value: "create-voice" }
            ]
        },
        {
            name: "channel",
            description: "Kênh văn bản bạn muốn thiết lập",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
}).addSlashCommand(async (client, interaction) => {
    const options = interaction.options.getString("options");
    let channel = interaction.options.getChannel("channel");
    await interaction.reply({ content: "Đang thiết lập kênh, xin vui lòng chờ trong giây lát..." });
    if (options === "welcome") {
        const data = await welcomeGoodbye.get(interaction.guild.id);
        if (data?.WelcomeChannel.includes(channel.id)) return interaction.editReply({ content: "Bạn đã thiết lập kênh này ở trong cơ sở dữ liệu rồi" });
        channel.send({ content: "Tin nhắn chào mừng sẽ xuất hiện ở đây" }).then(async () => {
            if (!data) {
                interaction.editReply({ content: `Kênh chào mừng đã được thiết lập ở ${channel.id}.` });
                return await welcomeGoodbye.set(interaction.guild.id, {
                    GuildId: interaction.guild.id,
                    GuildName: interaction.guild.name,
                    WelcomeChannel: channel.id,
                    GoodbyeChannel: "",
                    AutoAddRoleWel: [],
                });
            } else {
                data.WelcomeChannel = channel.id;
                await welcomeGoodbye.set(interaction.guild.id, data);
                return interaction.editReply({ content: `Kênh chào mừng đã được thiết lập ở ${channel.id}!` });
            };
        });
    } else if (options === "goodbye") {
        const data = await welcomeGoodbye.get(interaction.guild.id);
        if (data?.GoodbyeChannel.includes(channel.id)) return interaction.editReply({ content: "Bạn đã thiết lập kênh này ở trong cơ sở dữ liệu rồi" });
        channel.send({ content: "Tin nhắn tạm biệt sẽ xuất hiện ở đây" }).then(async () => {
            if (!data) {
                interaction.editReply({ content: `Kênh tạm biệt đã được thiết lập ở ${channel.id}.` });
                return await welcomeGoodbye.set(interaction.guild.id, {
                    GuildId: interaction.guild.id,
                    GuildName: interaction.guild.name,
                    WelcomeChannel: "",
                    GoodbyeChannel: channel.id,
                    AutoAddRoleWel: [],
                });
            } else {
                data.GoodbyeChannel = channel.id;
                await welcomeGoodbye.set(interaction.guild.id, data);
                return interaction.editReply({ content: `Kênh tạm biệt đã được thiết lập ở ${channel.id}!` });
            };
        });
    } else if (options === "music") {
        const guildData = await musicDb.get(interaction.guild.id);
        if (!guildData) return;
        if (guildData?.ChannelId.includes(channel.id)) return interaction.editReply({ content: "Bạn đã thiết lập kênh này ở trong cơ sở dữ liệu rồi" });
        if (guildData) return channel.send(musicEmbedDefault(client, interaction.guild)).then(async (msg) => {
            guildData.ChannelId = channel.id;
            guildData.MessageId = msg.id;
            await musicDb.set(interaction.guild.id, guildData);
            return interaction.editReply({ content: `**Thiết lập thành công Hệ thống Âm nhạc trong:** <#${channel.id}>` });
        });
    } else if (options === "create-voice") {
        const data = await channelSchema.get(interaction.guild.id);
        if (!data) return;
        if (data?.ChannelAutoCreateVoice.includes(channel.id)) return interaction.editReply({ content: "Bạn đã thiết lập kênh này ở trong cơ sở dữ liệu rồi" });
        data.ChannelAutoCreateVoice = channel.id;
        await channelSchema.set(interaction.guild.id, data);
        return await interaction.editReply({ content: `Đã thiết lập thành công kênh tự động tạo voice ở ${channel.id}` });
    };
});
// console.log(slashCommand.toJSON());
export default slashCommand;