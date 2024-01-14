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
  description: "Thêm tiền cho thành viên", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const user = message.mentions.users.first() || message.author;
    if(!user) return message.reply("Vui lòng thêm người cần add tiền");
    const money = parseInt(args[1]);
    if(!money) return message.reply("Bạn vui lòng nhập thêm số tiền")
    let result = await client.cs.addMoney({ 
      user: user, // mention
      guild: { id : null },
      amount: money,
      wheretoPutMoney: "wallet"
    });
    if(result.error) {
      return message.reply({ content: "Bạn không thể thêm tiền âm" });
    } else message.reply({ content: `Đã thêm thành công ${await client.cs.formatter(money)} vào ${user.username}.` });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;