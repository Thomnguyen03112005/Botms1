import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ComponentType } from "discord.js";
import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paginationEmbed = async(interaction, pages, buttonList, timeout = 120000) => {
  if (!pages) return console.log("Các trang không được đưa ra.");
  if (!buttonList) return console.log("Cần hai nút.");
  if (buttonList[0].style === "Link" || buttonList[1].style === "LINK") return console.log("Các nút liên kết không được hỗ trợ.");
  if (buttonList.length !== 2) return console.log("Cần hai nút.");
  let page = 0;
  const row = new ActionRowBuilder()
    .addComponents(buttonList[0])
    .addComponents(buttonList[1]);
  // tương tác đã được hoãn lại chưa? Nếu không, hoãn trả lời.
  if (interaction.deferred == false) await interaction.deferReply();
  const curPage = await interaction.editReply({
    embeds: [pages[page].setFooter({ text: `Trang ${page + 1} / ${pages.length}` })],
    components: [row],
    fetchReply: true,
  });

  const collector = await curPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id)
      i.reply(
        "Bạn không thể sử dụng nút này! Hãy tự chạy lệnh để sử dụng nút này."
      );
    switch (i.customId) {
      case buttonList[0].data.custom_id:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].data.custom_id:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
      components: [row],
    });
    collector.resetTimer();
  });
};
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "Xem cửa hàng có những gì", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const chunkSize = 10; // số mục trên mỗi trang nhúng
    // 10 là giới hạn tối đa cho các trường embed
    const timeout = 60 * 1000; // 60*1000 = 1 phút) tính bằng mili giây
    // thời gian chờ sẽ được đặt lại khi người dùng nhấp vào nút
    let result = await client.cs.getShopItems({ guild: { id: null } });
    let arr = [];
    for (let key in result.inventory) {
      arr.push({
        name: `${parseInt(key) + 1} - **${result.inventory[key].name}:** giá $${result.inventory[key].price}`,
        value: "Mô tả: " + result.inventory[key].description,
      });
    }
    if(arr.length > chunkSize) {
      let arrayOfEmbeds = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        const embed = new EmbedBuilder().setDescription("Shop!").addFields(chunk);
        arrayOfEmbeds.push(embed);
      };
      const button1 = new ButtonBuilder()
      .setCustomId("previousbtn")
      .setLabel("Trước")
      .setStyle("Danger");
      const button2 = new ButtonBuilder()
      .setCustomId("nextbtn")
      .setLabel("Kế tiếp")
      .setStyle("Success");
      if(arrayOfEmbeds.length <= 0) return message.reply("Không có mặt hàng trong cửa hàng!");
      await paginationEmbed(message, arrayOfEmbeds, [button1, button2], timeout);
    } else {
      const embed = new EmbedBuilder().setDescription("Shop!").addFields(arr);
      message.reply({ embeds: [embed] });
    };
});
  
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;