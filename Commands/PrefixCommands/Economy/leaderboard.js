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
  aliases: ["ldb", "ebxh"], // lệnh phụ
  description: "Xem danh sách các đại gia :)))", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let data = await client.cs.leaderboard(null);
    if(data.length < 1) return message.reply("Chưa có ai trong bảng xếp hạng.");
    const msg = new EmbedBuilder();
    let pos = 0;
    // Điều này là để có được 10 người dùng đầu tiên )
    let arr = [];
    data.slice(0, 10).map((e) => {
      if(!client.users.cache.get(e.userID)) return;
      pos++;
      arr.push({
        name: `${pos} - **${client.users.cache.get(e.userID).username}**`,
        value: `Wallet: **${e.wallet}** - Bank: **${e.bank}**`,
        inline: true,
      });
    });
    msg.addFields(arr);
    message.reply({ embeds: [msg] }).catch();
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;