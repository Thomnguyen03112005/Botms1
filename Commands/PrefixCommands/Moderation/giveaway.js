import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandName = path.parse(__filename).name;
const commands = new commandBuilders({
  name: commandName, // Tên Lệnh chính 
  usage: commandName, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["giv"], // lệnh phụ
  description: "Các lệnh giveaways trong server", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const giveawayOption = args[0]?.toLowerCase();
  if(giveawayOption === "starts") {
    return client.giveawaysManager.startGiveaway(message, message.channel);
  } else if(giveawayOption === "delete") {
    const deleteGive = args[1];
    if(!deleteGive) return message.reply({ content: "Vui lòng nhập id giveaways để xoá chúng" });
    return client.giveawaysManager.delete(deleteGive).then(() => {
      message.reply('Thành công! Quà tặng đã bị xóa!');
    }).catch((err) => {
      message.reply(`Đã xảy ra lỗi, vui lòng kiểm tra và thử lại.\n\`${err}\``);
    });
  } else {
    const embeds = new EmbedBuilders({
      title: { name: "Lệnh giveaways" },
      fields: [
        { name: `${prefix + commandName} starts`, value: "Bắt đầu giveaways" },
        { name: `${prefix + commandName} delete <id giveaways>`, value: "Xoá giveaways" }
      ],
      timestamp: Date.now(),
      colors: "Random"
    })
    return message.reply({ embeds: [embeds] });
  }
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;