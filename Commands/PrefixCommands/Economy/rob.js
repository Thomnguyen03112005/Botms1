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
  description: "Cướp tiền của ai đó", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const user = message.mentions.users.first();
    if(user.bot) return message.reply({ content: "Người dùng này là bot." });
    if(!user) return message.reply({ content: 'Xin lỗi, bạn đã quên đề cập đến ai đó.' });
    let result = await client.cs.rob({
      user: message.author,
      user2: user,
      guild: { id: null },
      minAmount: 100,
      successPercentage: 5,
      cooldown: 25, //25 giây,
      maxRob: 1000
    });
    if(result.error) {
      if(result.type === 'time') return message.reply({ content: `Gần đây bạn đã bị cướp Thử lại sau ${result.time}` });
      if(result.type === 'low-money') return message.reply({ content: `Bạn cần ít nhất ${await client.cs.formatter(result.minAmount)} cướp ai đó.` });
      if(result.type === 'low-wallet') return message.reply({ content: `${result.user2.username} có ít hơn ${await client.cs.formatter(result.minAmount)} để cướp.` });
      if(result.type === 'caught') return message.reply({ content: `${message.author.username} đã cướp ${result.user2.username} và đã bị bắt và đã phải trả lại ${await client.cs.formatter(result.amount)} cho ${result.user2.username}!` });
    } else {
      if(result.type === 'success') return message.reply({ content: `${message.author.username} bạn bị cướp bởi ${result.user2.username} và đã bị cướp mất ${await client.cs.formatter(result.amount)}` });
    };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;