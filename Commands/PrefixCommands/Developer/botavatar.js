import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "thay ảnh đại diện bot", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  try {
      var url;
      const database = client.config;
      if (message.attachments.size > 0) {
        if (message.attachments.every(attachIsImage)) {
          const response = await fetch(url);
          const buffer = await response.buffer();
          await fs.writeFile(`./image.jpg`, buffer, () => console.log('👍'));
          client.user.setAvatar(`./image.jpg`).then(user => {
              try {
                fs.unlinkSync("./image.jpg")
              } catch {}
              return message.reply({ content: `\`Đã thay đổi avatar thành công\``});
            }).catch(e => {
              return message.reply({ content: `\`Đã xảy ra lỗi:\`\n\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\`` });
            });
        } else {
          return message.reply({ content: `\`Không thể sử dụng Hình ảnh của bạn làm avatar, hãy đảm bảo rằng nó là: png/jpg\``});
        };
      } else if(message.content && textIsImage(message.content)) {
        url = args.join(" ")
        const response = await fetch(url);
        const buffer = await response.buffer();
        await fs.writeFile(`./image.jpg`, buffer, () => console.log('👍'));
        client.user.setAvatar(`./image.jpg`).then(user => {
            try {
              fs.unlinkSync("./image.jpg")
            } catch(e) {}
            return message.reply({ content: `\`Đã thay đổi avatar bot thành công\`` });
          }).catch(e => {
            return message.reply({ content: `\`Đã xảy ra lỗi:\`\n\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\`` });
          });
      } else {
        return message.reply({ embeds: [new EmbedBuilder()
          .setTitle(`\`Không thể sử dụng Hình ảnh của bạn làm avatar, hãy đảm bảo rằng đó là: png/jpg/webp\``)
          .setDescription(`Sử Dụng: \`${prefix}botavatar <ảnh/Link ảnh>\``)
          .setColor(database.colors.vang)
          .setFooter({ text: `${database.name}`, iconURL: `${database.avatar}`})
        ]});
      };
      function attachIsImage(msgAttach) {
        url = msgAttach.url;
        return url.indexOf("png", url.length - "png".length /*or 3*/ ) !== -1 || url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/ ) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/ ) !== -1;
      };
      function textIsImage(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
      };
  } catch(e) {
    return message.reply({ content: `\`Đã xảy ra lỗi:\`\n\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\`` });
  };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;