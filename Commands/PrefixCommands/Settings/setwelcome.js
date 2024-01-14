import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import { welcomeGoodbye } from "../../../Events/Assets/Schemas/databases.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
    name: path.parse(__filename).name, // Tên Lệnh chính
    usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
    category: path.parse(__dirname).name, // thể loại lệnh
    aliases: [], // lệnh phụ
    description: "Thiết lập kênh chào mừng cho guilds", // mô tả dành cho lệnh
    cooldown: 5, // thời gian hồi lệnh
    owner: false, // bật tắt chế độ dev
    permissions: ["Administrator"] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const data = await welcomeGoodbye.get(message.guild.id);
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply({ content: "Bạn chưa đề cập đến 1 kênh văn vản nào cả!" });
    return channel.send({ content: "Tin nhắn chào mừng sẽ xuất hiện ở đây" }).then(async() => {
        if (!data) {
            message.reply({ content: `Kênh chào mừng đã được thiết lập ở ${channel.id}.` });
            return await welcomeGoodbye.set(message.guild.id, {
                GuildId: message.guild.id,
                GuildName: message.guild.name,
                WelcomeChannel: channel.id,
                GoodbyeChannel: "",
                AutoAddRoleWel: [],
            });
        } else {
            data.WelcomeChannel = channel.id;
            await welcomeGoodbye.set(message.guild.id, data);
            return message.reply({ content: `Kênh chào mừng đã được thiết lập ở ${channel.id}!` });
        };
    });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;