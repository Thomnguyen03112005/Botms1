import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import Discord, { ChannelType, GuildVerificationLevel, GuildExplicitContentFilter, GuildNSFWLevel } from "discord.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["sinfo"], // lệnh phụ
  description: "Cung cấp thông tin về máy chủ", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const { members, channels, emojis, roles, stickers } = message.guild;
  const sortedRoles = roles.cache.map((role) => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
  const userRoles = sortedRoles.filter((role) => !role.managed);
  const managedRoles = sortedRoles.filter((role) => role.managed);
  const botCount = members.cache.filter((member) => member.user.bot).size;
  const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
    let totalLength = 0;
    const result = [];
    for (const role of roles) {
      const roleString = `<@&${role.id}>`;
      if(roleString.length + totalLength > maxFieldLength) break;
      totalLength += roleString.length + 1; // +1 vì có thể chúng tôi muốn hiển thị chúng với khoảng cách giữa mỗi vai trò, được tính vào giới hạn.
      result.push(roleString);
    };
    return result.length;
  };
  
  const splitPascal = (string, separator) => string.split(/(?=[A-Z])/).join(separator);
  const toPascalCase = (string, separator = false) => {
    const pascal = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    return separator ? splitPascal(pascal, separator) : pascal;
  };

  const getChannelTypeSize = (type) => channels.cache.filter((channel) => type.includes(channel.type)).size;
  const totalChannels = getChannelTypeSize([
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.GuildVoice,
    ChannelType.GuildStageVoice,
    ChannelType.GuildForum,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.AnnouncementThread,
    ChannelType.GuildCategory,
  ]);
  const embeds = new EmbedBuilders({
    title: { name: `Thông tin của: ${message.guild.name}` },
    thumbnail: message.guild.iconURL({ size: 1024 }),
    images: message.guild.bannerURL({ size: 1024 }),
    colors: "Random",
    fields: [
      { name: "Mô tả", value: `📝 ${message.guild.description || "Không có"}` },
      {
        name: 'Tổng quan',
        value: [
          `📜 **Tạo lúc** <t:${parseInt(message.guild.createdTimestamp / 1000)}:R>`,
          `💳 **ID** ${message.guild.id}`,
          `👑 **Người tạo** <@${message.guild.ownerId}>`,
          `🌍 **Ngôn ngữ** ${new Intl.DisplayNames(['vi'], { type: 'language' }).of(message.guild.preferredLocale)}`,
          `💻 **URL ảo** ${message.guild.vanityURLCode || "Không có"}`,
        ].join('\n'),
      },
      {
        name: 'Cấp độ bảo vệ',
        value: [
          `👀 **Bộ lọc rõ ràng** ${splitPascal(GuildExplicitContentFilter[message.guild.explicitContentFilter], ' ')}`,
          `🔞 **Cấp độ NSFW** ${splitPascal(GuildNSFWLevel[message.guild.nsfwLevel], " ")}`,
          `🔒 **Cấp độ xác minh** ${splitPascal(GuildVerificationLevel[message.guild.verificationLevel], ' ')}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: `Tổng số thành viên: ${message.guild.memberCount}`,
        value: [
          `👨‍👩‍👧‍👦 **Người** ${message.guild.memberCount - botCount}`,
          `🤖 **Bots** ${botCount}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: `Roles của người (${maxDisplayRoles(userRoles)} trên ${userRoles.length})`,
        value: `${userRoles.slice(0, maxDisplayRoles(userRoles)).join(' ') || "Không có"}`,
      },
      {
        name: `Roles của bots (${maxDisplayRoles(managedRoles)} trên ${managedRoles.length})`,
        value: `${managedRoles.slice(0, maxDisplayRoles(managedRoles)).join(' ') || "Không có"}`,
      },
      {
        name: `Kênh, Chủ đề & Danh mục (${totalChannels})`,
        value: [
          `💬 **Kênh văn bản** ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildAnnouncement])}`,
          `🎙 **Kênh Voice** ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`,
          `🧵 **chủ đề** ${getChannelTypeSize([ChannelType.PublicThread, ChannelType.PrivateThread, ChannelType.AnnouncementThread])}`,
          `📑 **Thể loại** ${getChannelTypeSize([ChannelType.GuildCategory])}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: `Emojis & Stickers (${emojis.cache.size + stickers.cache.size})`,
        value: [
          `📺 **Emoji động** ${emojis.cache.filter((emoji) => emoji.animated).size}`,
          `🗿 **Emoji tĩnh** ${emojis.cache.filter((emoji) => !emoji.animated).size}`,
          `🏷 **Stickers** ${stickers.cache.size}`,
        ].join('\n'),
        inline: true,
      },
      {
        name: 'Nitro',
        value: [
          `📈 **Tier** ${message.guild.premiumTier || "Không có"}`,
          `💪🏻 **Boosts** ${message.guild.premiumSubscriptionCount}`,
          `💎 **Boosters** ${message.guild.members.cache.filter((member) => member.roles.premiumSubscriberRole).size}`,
          `🏋🏻‍♀️ **Tất cả Boosters** ${message.guild.members.cache.filter((member) => member.premiumSince).size}`,
        ].join('\n'),
        inline: true,
      },
      { name: 'Banner', value: message.guild.bannerURL() ? '** **' : "Không có" }
    ],
  });
  message.reply({ embeds: [embeds] });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;