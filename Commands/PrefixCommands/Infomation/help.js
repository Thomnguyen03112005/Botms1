import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import { readdirSync } from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
   if(!args[0]) {
            const categories = readdirSync(`./Commands/PrefixCommands/`);
            const embed = new EmbedBuilder()
                .setAuthor({ name: `❯ ・ Commands list - ${client.commands.size} Commands`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setColor("Random")
            for (const category of categories) {
                const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ", "\n");
                embed.addFields({ name: `${(category)} Commands`, value: `> ${commands}`, inline: false });
            };
            return message.channel.send({ embeds: [embed] });
        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
            if(!command) return message.channel.send({ 
               content: "Ồ có vẻ như tôi không có lệnh đó"
            });
            return message.channel.send({ embeds: [new EmbedBuilder()
                .setTitle("Chi tiết lệnh:")
                .setThumbnail('https://hzmi.xyz/assets/images/question_mark.png')
                .addFields({ name: "Tên lệnh:", value: command.name ? `\`${command.name}\`` : "Không có tên cho lệnh này.", inline: true })
                .addFields({ name: "Sử dụng:", value: command.usage ? `\`${command.usage}\`` : `\`${prefix}${command.name}\``, inline: true })
                .addFields({ name: 'Lệnh Phụ', value: command.aliases ? command.aliases.join(", ") : "không có lệnh phụ.", inline: true })
                .addFields({ name: "Mô tả lệnh:", value: command.description ? command.description : "Không có mô tả cho lệnh này.", inline: true })
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor("Random")]
            });    
        };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;