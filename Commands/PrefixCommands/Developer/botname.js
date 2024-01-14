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
  description: "Thay đổi tên bott", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  try {
    if(!args[0]) return message.reply("vui lòng nhập tên muốn đổi");
    if(args.join(" ").length > 32) return message.reply({ 
      content: `tên bot quá dài, tên bot không thể dài hơn 32 chữ cái`
    });
    client.user.setUsername(args.join(" ")).then((user) => {
      return message.reply({ content: `Đã đổi tên thành: \`${user.username}\`` });
    }).catch(e => {
      return message.reply({ content: 'Đã sảy ra lỗi thử lại sau' });
    });
  } catch(e) {
    return console.log(String(e.stack));
  };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;