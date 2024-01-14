import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } from "discord.js";
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
  description: "Xem danh sách sever mà bot hỗ trợ", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: true, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const { channel, member } = message;
    const IDLE_TIMEOUT = 30; // trong vài giây
    const MAX_PER_PAGE = 10; // số lượng trường embed tối đa trên mỗi trang
    const matched = [];
    const match = args.join(" ") || null;
    if (match) {
      // khớp theo id
      if (client.guilds.cache.has(match)) {
        matched.push(client.guilds.cache.get(match));
      };
      // khớp theo tên
      client.guilds.cache.filter((g) => g.name.toLowerCase().includes(match.toLowerCase())).forEach((g) => matched.push(g));
    };
    const servers = match ? matched : Array.from(client.guilds.cache.values());
    const total = servers.length;
    const maxPerPage = MAX_PER_PAGE;
    const totalPages = Math.ceil(total / maxPerPage);
    if (totalPages === 0) return message.safeReply("Không tìm thấy máy chủ");
    let currentPage = 1;
    // Hàng button
    let components = [];
    components.push(
      new ButtonBuilder().setCustomId("prevBtn").setEmoji("⬅️").setStyle(ButtonStyle.Secondary).setDisabled(true),
      new ButtonBuilder().setCustomId("nxtBtn").setEmoji("➡️").setStyle(ButtonStyle.Secondary).setDisabled(totalPages === 1)
    );
    let buttonsRow = new ActionRowBuilder().addComponents(components);
    // Trình tạo embed
    const buildEmbed = () => {
      const start = (currentPage - 1) * maxPerPage;
      const end = start + maxPerPage < total ? start + maxPerPage : total;
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setAuthor({ name: "Danh sách máy chủ" })
        .setFooter({ text: `${match ? "Phù hợp" : "Tổng cộng"} máy chủ: ${total} • Trang ${currentPage}/${totalPages}` });
      const fields = [];
      for (let i = start; i < end; i++) {
        const server = servers[i];
        fields.push({ name: `${server.name}/${server.memberCount} thành viên`, value: server.id, inline: true });
      }
      embed.addFields(fields);
      let components = [];
      components.push(
        ButtonBuilder.from(buttonsRow.components[0]).setDisabled(currentPage === 1),
        ButtonBuilder.from(buttonsRow.components[1]).setDisabled(currentPage === totalPages)
      );
      buttonsRow = new ActionRowBuilder().addComponents(components);
      return embed;
    };
    // Gửi tin nhắn
    const embed = buildEmbed();
    const sentMsg = await channel.send({ embeds: [embed], components: [buttonsRow] });
    // Liệt kê
    const collector = channel.createMessageComponentCollector({
      filter: (reaction) => reaction.user.id === member.id && reaction.message.id === sentMsg.id,
      idle: IDLE_TIMEOUT * 1000,
      dispose: true,
      componentType: ComponentType.Button,
    });
    collector.on("collect", async(response) => {
      if (!["prevBtn", "nxtBtn"].includes(response.customId)) return;
      await response.deferUpdate();
      switch (response.customId) {
        case "prevBtn":
          if (currentPage > 1) {
            currentPage--;
            const embed = buildEmbed();
            await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
          } break;
        case "nxtBtn":
          if (currentPage < totalPages) {
            currentPage++;
            const embed = buildEmbed();
            await sentMsg.edit({ embeds: [embed], components: [buttonsRow] });
          } break;
      }
      collector.on("end", async () => {
        await sentMsg.edit({ components: [] });
      });
    });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;