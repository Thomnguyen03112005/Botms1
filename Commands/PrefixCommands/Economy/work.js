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
  description: "Kiếm tiền làm việc của bạn", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let result = await client.cs.work({
      user: message.author,
      maxAmount: 100,
      guild: { id: null },
      replies: ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic'],
      cooldown: 25 //25 giây,
    });
    if (result.error) {
      return message.reply({ content: `Gần đây bạn đã làm việc xong Thử lại sau ${result.time}` });
    } else message.reply(`Bạn đã làm việc như một ${result.workType} và kiếm được ${await client.cs.formatter(result.amount)}.`)
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;