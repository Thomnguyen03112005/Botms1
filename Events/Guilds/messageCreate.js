import Discord, { EmbedBuilder, PermissionsBitField, Collection, Events } from "discord.js";
import { Prefix as prefixSchema, music as PlayMusicData } from "../Assets/Schemas/databases.js";
import { eventBuilders } from "../functions.js";
import colors from 'chalk';

const onCoolDown = (cooldowns, message, commands) => {
  if (!message || !commands) return;
  let { member } = message;
  if (!cooldowns.has(commands.name)) {
    cooldowns.set(commands.name, new Collection());
  };
  const now = Date.now();
  const timestamps = cooldowns.get(commands.name);
  const cooldownAmount = commands.cooldown * 1000;
  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000; //có được thời gian còn lại
      return timeLeft;
    } else {
      timestamps.set(member.id, now);
      setTimeout(() => timestamps.delete(member.id), cooldownAmount);
      return false;
    };
  } else {
    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    return false;
  };
};

const automusic = async (client, message) => {
  const data = await PlayMusicData.get(message.guild?.id);
  if (!data) return;
  if (!message.guild || !message.guild.available) return;
  if (!data.ChannelId || data.ChannelId.length < 5) return;
  let textChannel = message.guild.channels.cache.get(data.ChannelId) || await message.guild.channels.fetch(data.ChannelId).catch(() => { }) || false;
  if (!textChannel) return console.log("Không có channel nào được thiết lập");
  if (textChannel.id != message.channel.id) return;
  // xoá tin nhắn 
  if (message.author.id === client.user.id) {
    setTimeout(() => {
      if (!message.deleted) {
        message.delete();
      };
    }, 3000);
  } else {
    if (!message.deleted) {
      message.delete().catch((e) => { });
    };
  };
  if (message.author.bot) return;
  // kiểm tra xem thành viên có ở trong voice hay không
  if (!await message.member.voice.channel) return message.channel.send({
    content: "Bạn cần phải ở trong một kênh voice"
  });
  // yêu cầu phát nhạc
  await client.distube.play(message.member.voice.channel, message.cleanContent, {
    member: message.member,
    textChannel: message.channel,
    message,
  });
};

// Chạy events :))
const messageCreate = new eventBuilders({
  eventCustomName: "messageCreate.js", // Tên sự kiện tùy chọn
  eventName: Events.MessageCreate, // tên sự kiện theo Discord.Events
  eventOnce: false, // khởi chạy 1 lần 
  executeEvents: async (client, message) => {
    if (message.author.bot || !message.guild) return;
    // automusic
    await automusic(client, message);
    // prefix 
    const prefixDT = await prefixSchema.get(message.guild.id);
    if (!prefixDT) return await prefixSchema.set(message.guild.id, {
      GuildId: message.guild.id,
      GuildName: message.guild.name,
      Prefix: client.config.prefix,
    });
    const prefix = prefixDT.Prefix;
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [matchedPrefix] = message.content.match(prefixRegex);
    if (!message.content.startsWith(matchedPrefix)) return;
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) return message.reply({
      embeds: [new EmbedBuilder().setDescription("Prefix của tôi là:" + ` \`${prefix}\``)]
    });
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
      try {
        const embed = new EmbedBuilder().setTitle("Thiếu quyền").setColor("Random")
        if (command.permissions) {
          if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) return message.reply({
            embeds: [embed.setDescription(`Bạn không có quyền ${command.permissions} để sử dụng lệnh này`)],
          });
        };
        if (onCoolDown(client.cooldowns, message, command)) return message.reply({
          content: `❌ Bạn đã sử dụng lệnh quá nhanh vui lòng đợi ${onCoolDown(client.cooldowns, message, command).toFixed()} giây trước khi sử dụng lại \`${command.name}\``
        });
        if (command.owner && message.author.id !== client.config.developer) return message.reply({
          embeds: [embed.setDescription(`Bạn không thể sử dụng lệnh này chỉ có <@${client.config.developer}> mới có thể sử dụng`)]
        });
        if (command.command) {
          command.command(client, message, args, prefix);
        } else {
          command.run(client, message, args, prefix);
        };
      } catch (error) {
        console.log(error.toString());
        message.reply({ content: "Lỗi đã được gởi đi :))" });
      };
    } else return message.reply({ content: `Sai lệnh. nhập ${prefix}help để xem lại tất cả các lệnh` }).then((msg) => {
      setTimeout(() => msg.delete(), 10000);
    });
  },
});

export default messageCreate;