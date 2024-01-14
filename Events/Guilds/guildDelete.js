import { eventBuilders, EmbedBuilders } from "../functions.js";
import { channelSchema } from "../Assets/Schemas/databases.js";

const guildDelete = new eventBuilders({
  eventCustomName: "guildDelete.js", // Tên sự kiện tùy chọn
  eventName: "guildDelete", // tên sự kiện theo Discord.Events
  eventOnce: false, // khởi chạy 1 lần 
  executeEvents: async (client, guild) => {
    const getData = await channelSchema.get(guild.id);
    if (!getData) return;
    const channels = guild.channels.cache.find((channel) => channel.id === getData.guildDelete);
    if (!channels) return;
    // lấy owner vvaluealue
    let owner = await guild.fetchOwner();
    // khởi tạo embeds 
    const embeds = new EmbedBuilders({
      description: `Tôi đã bị kick khỏi \`${guild.name}\` và tổng số guilds còn lại: \`${client.guilds.cache.size}\``,
      footer: { text: client.user.tag, icon_url: client.user.displayAvatarURL({ dynamic: true }) },
      author: { name: guild.name, icon_url: owner.user.displayAvatarURL({ dynamic: true }) },
      thumbnail: { url: guild.iconURL({ dynamic: true }) },
      timestamp: Date.now(),
      fields: [
        { name: `👑| Tên chủ sở hữu: `, value: `\`${owner.user.tag}\``, inline: true },
        { name: `👓| ID chủ sở hữu: `, value: `\`${owner.user.id}\``, inline: true },
        { name: `👥| Tổng số thành viên:`, value: `\`${guild.members.cache.size}\``, inline: true },
        { name: `🆔| Guild ID:`, value: `**\`${guild.id}\`**`, inline: true },
        { name: `📅| tạo lúc:`, value: `**<t:${Date.parse(guild.createdAt) / 1000}:D> | <t:${Date.parse(guild.createdAt) / 1000}:R>**`, inline: true }
      ],
    });
    // gửi tin nhắn vào channel
    return channels.send({ embeds: [embeds] });
  },
});

export default guildDelete;