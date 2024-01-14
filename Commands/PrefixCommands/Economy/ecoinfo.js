import { commandBuilders } from "../../../Events/functions.js";
import { EmbedBuilder } from "discord.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "Một cách để xem thông tin mua sắm", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let result = await client.cs.info(message.member.id, message.guild.id);
    const embed = new EmbedBuilder().setDescription('thông tin về ' + `<@${message.member.id}>`);
    let unUsed = '';
    let cantBeUsed = '';
    for (const [key, value] of result.info) {
        if (value.used) unUsed += `- ${key}\n`;
        else cantBeUsed += `- ${key} ( ${value.timeLeft} )\n`;
    };
    embed.addFields([
        { name: 'Các lệnh kiếm tiền mà bạn có thể sử dụng:', value: unUsed || "Không có" },
        { name: 'Các lệnh mà bạn không thể sử dụng:', value: cantBeUsed ? cantBeUsed : "Không có" },
    ]);
    message.reply({
        embeds: [embed]
    });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;