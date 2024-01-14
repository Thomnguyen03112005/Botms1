import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["give"], // lệnh phụ
  description: "Chuyển tiền cho thành viên hoặc bạn của bạn", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const user = message.mentions.users.first();
    let amount = args[1];
    if (!amount) return message.reply("Enter amount of money to add.");
    if (String(amount).includes("-")) return message.reply("Bạn không thể gửi tiền âm.")
    let money = parseInt(amount);
    let result = await client.cs.transferMoney({
      user: message.author,
      user2: user,
      guild: { id: null },
      amount: money
    });
    try {
      if(result.error) {
        return message.reply({ 
          content: `Bạn không có đủ tiền trong ví.`
        });
      } else message.reply({ 
        content: `**${message.author.username}**, Đã chuyển thành công **${await client.cs.formatter(result.money)}** cho **${result.user2.username}**`
      });
    } catch(ex) {
      return message.reply({ content: "Thành viên chưa có trong cơ sở dữ liệu, Đã tạo dữ liệu thành viên :))" });
    };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;