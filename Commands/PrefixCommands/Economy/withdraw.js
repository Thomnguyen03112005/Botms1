import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["bank"], // lệnh phụ
  description: "Rút tiền ra khỏi ngân hàng của bạn", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let money = args[0];
    if(!money) return message.reply({ content: "Nhập số tiền bạn muốn rút." });
    let result = await client.cs.withdraw({
      user: message.author,
      guild: { id: null },
      amount: money,
    });
    if(result.error) {
      if(result.type === "money") return message.reply("Chỉ định số tiền cần rút");
      if(result.type === "negative-money") return message.reply("Bạn không thể rút tiền âm, vui lòng sử dụng lệnh gửi tiền");
      if(result.type === "low-money") return message.reply("Bạn không có nhiều tiền trong ngân hàng.");
      if(result.type === "no-money") return message.reply("Bạn không có tiền để rút");
    } else {
      if(result.type === "all-success") return message.reply("Bạn đã rút hết tiền từ ngân hàng của bạn" + `\nBây giờ bạn đã có ${await client.cs.formatter(result.rawData.wallet)} Trong ví và ${await client.cs.formatter(result.rawData.bank)} trong ngân hàng của bạn.`);
      if(result.type === "success") return message.reply(`Bạn đã rút ${await client.cs.formatter(result.amount)} từ ngân hàng.\nBây giờ, bạn có ${await client.cs.formatter(result.rawData.wallet)} trong ví và ${await client.cs.formatter(result.rawData.bank)} trong ngân hàng của bạn.`);
    };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;