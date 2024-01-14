import Discord, { PermissionsBitField } from "discord.js";
import { ticketModalSetup, addToTicket, closeTicket, closeAllTickets, removeFromTicket } from "../../../Handlers/ticket.js";
import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
    name: path.parse(__filename).name, // Tên Lệnh chính
    usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
    category: path.parse(__dirname).name, // thể loại lệnh
    aliases: ["tik"], // lệnh phụ
    description: "Tổng hợp 1 số lệnh ticket", // mô tả dành cho lệnh
    cooldown: 5, // thời gian hồi lệnh
    owner: false, // bật tắt chế độ dev
    permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const embed = new EmbedBuilders({ timestamp: Date().now });
    const commandName = args[0].toLowerCase();
    if (commandName === "create") {
        let ChannelId = message.mentions.channels.first();
        if (!ChannelId) return message.reply({ content: `**Bạn quên ping một Text-Channel!**` });
        return ticketModalSetup(message, ChannelId);
    } else if (commandName === "add") {
        if (!args[0]) return message.reply("Vui lòng cung cấp id thành viên hoặc id role để thêm vào yêu cầu");
        const response = await addToTicket(message, args[0]);
        return message.reply(response);
    } else if (commandName === "close") {
        return message.channel.send(await closeTicket(message, message.author));
    } else if (commandName === "closeall") {
        const premissions = ["Administrator"];
        if (!message.member.permissions.has(PermissionsBitField.resolve(premissions))) return message.reply({
            embeds: [embed.setDescription(`Bạn không có quyền ${premissions} để sử dụng lệnh này`)],
        });
        let sent = await message.reply("Đóng tickets ...");
        const response = await closeAllTickets(message, message.author);
        return sent.editable ? sent.edit(response) : message.channel.send(response);
    } else if (commandName === "remove") {
        if (!args[0]) return message.reply("Vui lòng cung cấp thành viên hoặc role để xóa");
        let inputId;
        if (message.mentions.users.size > 0) {
            inputId = message.mentions.users.first().id;
        } else if (message.mentions.roles.size > 0) {
            inputId = message.mentions.roles.first().id;
        } else inputId = args[1];
        const response = await removeFromTicket(message, inputId);
        message.reply(response);
    };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;