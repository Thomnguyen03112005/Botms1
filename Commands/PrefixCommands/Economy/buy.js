import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "Mua đồ trong cửa hàng", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  let thing = args[0];
  if(!thing) return message.reply("Vui lòng cung cấp số mặt hàng");
  if(isNaN(thing)) return message.reply("Vui lòng cung cấp số mặt hàng hợp lệ");
  let result = await client.cs.buy({
    user: message.author,
    guild: { id: null },
    item: parseInt(thing),
    amount: args[1] || 1,
  });
  if(result.error) {
    if(result.type === "No-Item") return message.reply("Vui lòng cung cấp số mặt hàng hợp lệ");
    if(result.type === "Invalid-Item") return message.reply("mục không tồn tại");
    if(result.type === "low-money") return message.reply(`**Bạn không có đủ số dư để mua mặt hàng này!**`);
    if(result.type === "Invalid-Amount") return message.channel.send("Không thể thêm ít hơn 1 mục.");
  } else return message.reply(`**Mua thành công ${args[1] || 1} \`${result.inventory.name}\` với giá $${result.price}**`);
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;