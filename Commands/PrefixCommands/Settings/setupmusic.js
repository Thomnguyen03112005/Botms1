import { musicEmbedDefault } from "../../../Handlers/DistubeEvents.js";
import { commandBuilders } from "../../../Events/functions.js";
import { music as database } from "../../../Events/Assets/Schemas/databases.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["sums", "setupdefaultmusic"], // lệnh phụ
  description: "Thiết lập chế độ tự động phát nhạc trong channels", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: ["Administrator"] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let channel = message.mentions.channels.first();
    if(!channel) return message.reply({ content: "Bạn chưa đề cập đến channels nào cả" });
    const guildData = await database.get(message.guild.id);
    if(!guildData) return;
    return channel.send(musicEmbedDefault(client, message.guild)).then(async(msg) => {
        // Cập nhật thuộc tính setDefaultVolume với giá trị mới
        guildData.ChannelId = channel.id;
        guildData.MessageId = msg.id;
        await database.set(message.guild.id, guildData);
        return message.reply({ content: `Đã thiết lập thành công hệ thống âm nhạc ở ${channel.id}` });
    });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;