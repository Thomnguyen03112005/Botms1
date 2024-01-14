import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["balance"], // lệnh phụ
  description: "Xem số dư tài khoản của bạn", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async(client, message, args, prefix) => {
  const user = message.mentions.users.first() || message.author;
  let result = await client.cs.balance({
    user: user,
    guild: { id: null }
  });
  return message.reply({
    content: `${user.username}, Bạn có ${await client.cs.formatter(result.wallet)} trong ví và ${await client.cs.formatter(result.bank)} trong ngân hàng.`
  });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;