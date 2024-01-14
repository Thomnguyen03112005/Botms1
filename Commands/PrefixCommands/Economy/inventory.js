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
  aliases: ["inv"], // lệnh phụ
  description: "Xem trong kho bạn có món hàng gì", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let result = await client.cs.getUserItems({
      user: message.author,
      guild: { id: null },
    });
    let inv = result.inventory.slice(0, 10);
    const embed = new EmbedBuilder().setDescription("Kho đồ của bạn trống rỗng!");
    let arr = [];
    for (key of inv) {
      arr.push({ name: `**${key.name}:**`, value: `Số lượng: ${key.amount}` });
      embed.setDescription("Kho đồ của bạn!");
    };
    embed.addFields(arr);
    return message.reply({ embeds: [embed] });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;