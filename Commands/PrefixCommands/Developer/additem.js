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
  description: "Thêm mặt hàng vào shopp", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const itemName = args[0];
    if(!itemName) return message.reply("Vui lòng thêm tên sản phẩm");
    const itemPrice = Number(args[1]);
    if(!itemPrice || isNaN(itemPrice)) return message.reply("Vui lòng thêm giá tiền hoặc chỉ định số tiền hợp lệ");
    const itemDescription = args[2];
    let result = await client.cs.addItem({
        guild: { id: null },
        inventory: {
            name: itemName,
            price: itemPrice,
            description: itemDescription ? itemDescription : "Không có mô tả"
        }
    });
    if(result.error) {
      if(result.type == 'No-Inventory-Name') return message.reply('Đã xảy ra lỗi, Vui lòng nhập tên mục để thêm.!')
      if(result.type == 'Invalid-Inventory-Price') return message.reply('Đã xảy ra lỗi, giá không hợp lệ!')
      if(result.type == 'No-Inventory-Price') return message.reply('Đã xảy ra lỗi, Bạn không chỉ định giá!')
      if(result.type == 'No-Inventory') return message.reply('Đã xảy ra lỗi, Không nhận được dữ liệu!')
    } else return message.reply('Xong! Thêm thành công vào cửa hàng!')
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;