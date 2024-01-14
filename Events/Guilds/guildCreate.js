import { eventBuilders, EmbedBuilders } from "../functions.js";
import { channelSchema } from "../Assets/Schemas/databases.js";
import colors from 'chalk';

const guildCreate = new eventBuilders({
  eventCustomName: "guildCreate.js", // Tên sự kiện tùy chọn
  eventName: "guildCreate", // tên sự kiện theo Discord.Events
  eventOnce: false, // khởi chạy 1 lần 
  executeEvents: async (client, guild) => {
    const getData = await channelSchema.get(guild.id);
    if (!getData) return;
    // Tin nhắn gửi đến channel mà bot có thể gửi. :)) 
    const guilds = await guild.channels.cache.find((channels) => channels.type === ChannelType.GuildText && channels.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite && PermissionFlagsBits.SendMessages));
    // gởi tin nhắn vào kênh nhật ký
    const channels = guild.channels.cache.find((channel) => channel.id === getData.guildCreate);
    if (!channels) return;
    let inviteLink = await guilds.createInvite({ maxAge: 0, maxUses: 0 }).catch(() => { });
    let owner = await guild.fetchOwner();
    // Gửi tin nhắn vào chanel
    return channels.send({
      embeds: [new EmbedBuilders()
        .setAuthor({ name: guild.name, iconURL: owner.user.displayAvatarURL({ dynamic: true }) })
        .setDescription(`Tôi đã thêm vào \`${guild.name}\` và tổng số guild của tôi là: \`${client.guilds.cache.size}\``)
        .addFields([
          { name: `👑| Tên chủ sở hữu: `, value: `\`${owner.user.tag}\``, inline: true },
          { name: `👓| ID chủ sở hữu: `, value: `\`${owner.user.id}\``, inline: true },
          { name: `👥| Tổng số thành viên:`, value: `\`${guild.members.cache.size}\``, inline: true },
          { name: `📬| Link tham gia: `, value: `**${inviteLink ? `${inviteLink}` : "không tạo được :("}**`, inline: true },
          { name: `🆔| Guild ID:`, value: `**\`${guild.id}\`**`, inline: true },
          { name: `📅| Tạo lúc:`, value: `**<t:${Date.parse(guild.createdAt) / 1000}:D> | <t:${Date.parse(guild.createdAt) / 1000}:R>**`, inline: true }
        ])
        .setColor("Random")
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp(Date.now())
      ]
    });
  },
});

export default guildCreate;