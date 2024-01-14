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
  description: "Một cách để kiếm tiền beg", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  let result = await client.cs.beg({
    user: message.author,
    guild: { id: null },
    minAmount: 100,
    maxAmount: 1000,
    cooldown: 10 // 10 giây
  });
  if (result.error) {
    return message.reply({ content: `Gần đây bạn đã beg Hãy thử lại sau ${result.time}` });
  } else message.reply({ content: `Bạn đã kiếm được ${await client.cs.formatter(result.amount)}.` });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;