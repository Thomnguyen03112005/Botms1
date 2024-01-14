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
  description: "Một cách để thêm số tiền trong ngân hàng hoặc ví của mọi người", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async(client, message, args, prefix) => {
    let wheretoPutMoney = args[1];
    if(wheretoPutMoney) {
      wheretoPutMoney = 'bank';
    } else wheretoPutMoney = 'wallet';
    let amount = args[0]
    let money = parseInt(amount);
    let result = await client.cs.addMoneyToAllUsers({
        guild: { id: null },
        amount: money,
        wheretoPutMoney: wheretoPutMoney
    });
    if(result.error) {
      if(result.type === 'negative-money') return message.reply("Bạn không thể thêm tiền âm");
      else return message.reply('Không tìm thấy người dùng');
    } else message.reply(`Đã thêm thành công $${money} vào ${result.rawData.length} thành viên!, (${wheretoPutMoney})`)
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;