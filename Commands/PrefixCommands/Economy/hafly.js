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
  description: "Một cách để kiếm tiền, hafly", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let result = await client.cs.hafly({
        user: message.author,
        guild: { id: null },
        amount: 100,
    }); 
    if(result.error) {
      return message.reply({ content: `Gần đây bạn đã sử dụng hafly Thử lại trong ${result.time}` });
    } else return message.reply({ content: `Bạn đã kiếm được ${await client.cs.formatter(result.amount)}. (${result.rawData.streak.hafly})` });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;