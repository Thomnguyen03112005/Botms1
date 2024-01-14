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
  description: "Xoá tiền của người dùng", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const user = message.mentions.users.first() || message.author;
  let wheretoPutMoney = args[1];
  let amount = args[2];
  let result = await client.cs.removeMoney({
    user: user,
    amount: amount,
    guild: { id: null },
    wheretoPutMoney: wheretoPutMoney,
  });
  if(result.error) {
    return message.reply({ content: "Bạn không thể xóa tiền âm" });
  } else message.reply(`Đã xóa thành công ${amount === "all" ? "toàn bộ tiền" : `${await client.cs.formatter(amount)}`} của ${user.username}.`);
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;