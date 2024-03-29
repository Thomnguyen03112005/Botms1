import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["bankgive"], // lệnh phụ
  description: "Gửi tiền vào ngân hàng của bạn", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let money = args[0];
    if(!money) return message.reply("Nhập số tiền bạn muốn gửi.");
    let result = await client.cs.deposite({
      user: message.author,
      guild: { id: null },
      amount: money,
    });
    if(result.error) {
      if(result.type === "money") return message.reply({ content: "Chỉ định số tiền gửi" });
      if(result.type === "negative-money") return message.reply({ content: "Bạn không thể gửi tiền âm" });
      if(result.type === "low-money") return message.reply({ content: "Bạn không có nhiều tiền trong ví." });
      if(result.type === "no-money") return message.reply({ content: "Bạn không có tiền để ký gửi" });
      if(result.type === "bank-full") return message.reply({ content: "Ngân hàng của bạn đã đầy. Nó đã đạt đến giới hạn của nó." });
    } else {
      if(result.type === "all-success") return message.reply({ content: "Bạn đã gửi tất cả tiền của bạn vào ngân hàng của bạn" + `\nBây giờ bạn đã có ${await client.cs.formatter(result.rawData.wallet)} Trong ví của mình và ${await client.cs.formatter(result.rawData.bank)} trong ngân hàng của bạn.` });
      if(result.type === "success") return message.reply({ content: `Bạn đã gửi ${await client.cs.formatter(result.amount)} tiền vào ngân hàng của mình.\nBây giờ, bạn đã có ${await client.cs.formatter(result.rawData.wallet)} trong ví của mình và ${await client.cs.formatter(result.rawData.bank)} trong ngân hàng của bạn.` });
    };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;