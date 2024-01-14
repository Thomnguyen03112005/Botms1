import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import { Playlist } from "../../../Events/Assets/Schemas/databases.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  };
  return result;
};

const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: [], // lệnh phụ
  description: "custom playlist", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const commandName = args[0]?.toLowerCase();
  if (commandName === "create") {
    const allElements = await Playlist.all();
    const playlistName = args.slice(1).join(' ');
    var findName;
    allElements.map((e) => findName = e.data.name);
    if (findName.includes(playlistName)) {
      return message.reply({ content: "Đã có tên playlist này trong hệ thống vui lòng sử dụng tên playlist khác" });
    } else {
      const randomCode = generateRandomString(30);
      await Playlist.set(randomCode, {
        GuildId: message.guild.id,
        userId: message.author.id,
        name: playlistName,
        songs: {
          url: [],
          name: []
        },
        privacy: Boolean(true),
      });
      return message.reply({
        embeds: [new EmbedBuilders({
          author: { name: client.user.username },
          title: { name: "Id playlist của bạn là: " + randomCode },
          description: `✅ | Đã tạo Playlist với tên là **${playlistName.toUpperCase()}** được tạo bởi ${message.author.username}`,
          color: 0x2a9454
        })]
      });
    };
  }
  else if (commandName === "list") {
    const allPlaylist = await Playlist.all();
    const queueData = allPlaylist.map((queue, id) => {
      return [`**${id}.** ${queue.data.name.toUpperCase()} - \`${queue.ID}\``].join('\n');
    }).join('\n');
    return message.reply({
      embeds: [new EmbedBuilders({
        title: { name: "Danh sách playlist của guilds" },
        description: queueData,
        colors: "Random"
      })]
    });
  }
  else if (commandName === "delete") {
    const queueId = args[1];
    const data = await Playlist.get(queueId);
    if (!data) return message.reply({ content: 'Danh sách phát này không tồn tại.' });
    if (data.userId !== message.author.id) return message.reply({
      content: "Bạn chỉ có thể xóa danh sách phát của riêng mình"
    });
    await Playlist.delete(queueId);
    return message.reply({
      embeds: [new EmbedBuilders({
        description: `✅ | Đã xóa thành công Danh sách phát có ID được liên kết: **${queueId}**`,
        colors: "Random"
      })]
    });
  }
  else if (commandName === "add") {
    const playlistId = args[1];
    if (!playlistId) return message.reply({ content: "Vui lòng thêm id playlist" });
    const song = args.slice(2).join(" ");
    if (!song) return message.reply({ content: "Bạn chưa thêm tên của bài hát vui lòng thêm tên bài hát" });
    const data = await Playlist.get(playlistId);
    if (!data) return message.reply({ content: 'Danh sách phát này không tồn tại.' });
    if (data.userId !== message.author.id) return message.reply({ content: "Bạn chỉ có thể thêm các bài hát vào danh sách phát của riêng mình" });
    const songData = await client.distube.search(song, {
      limit: 1
    }).catch(() => message.reply({ content: 'Không tìm thấy bài hát nào.' }));

    const url = songData[0].url;
    const name = songData[0].name;

    if (data.songs.url.includes(url)) return message.reply({
      content: "Bài hát này đã có trong danh sách phát"
    });

    data.songs.url.push(url);
    data.songs.name.push(name);
    await Playlist.set(playlistId, data);

    return message.reply({
      embeds: [new EmbedBuilders({
        title: { name: "📜 | Thông tin danh sách phát" },
        description: `✅ | Đã thêm thành công **[${name}](${url})** vào Danh sách phát`,
        colors: "Random",
      })
      ]
    });
  }
  else if (commandName === "info") {
    const queueId = args[1];
    if (!queueId) return message.reply({ content: "Vui lòng nhập thêm playlist-id" });
    const data = await Playlist.get(queueId);
    if (!data) return message.reply({ content: `Danh sách phát này không tồn tại. Sử dụng \`${prefix}playlist list\` để xem id của danh sách phát` });
    const User = message.guild.members.cache.get(data.userId);
    let privacy;
    if (data.privacy === true) {
      privacy = 'Riêng tư';
    } else privacy = 'Công cộng';
    const rawFields = data.songs.name;
    let index = 1;
    const fields = rawFields.map((field) => {
      return [`**${index++}.** [${field}](${data.songs.url[index - 2]})`].join('\n');
    }).join('\n');

    return message.reply({
      embeds: [new EmbedBuilders({
        title: { name: "📜 | Thông tin danh sách phát" },
        description: `**Tên:** ${data.name.toUpperCase()}\n**ID:** ${queueId}\n**Trạng thái:** ${privacy}\n**Bài hát:**\n ${fields}\n**Được tạo bởi:** ${User}`,
        thumbnail: message.guild.iconURL({ dynamic: true }),
        footer: { text: 'BlackCat-Club' },
        timestamp: Date.now(),
        colors: "Random"
      })]
    });
  }
  else if (commandName === "play") {
    const { member, guild, channel } = message;
    const VoiceChannel = member.voice.channel;
    if (!VoiceChannel) return message.reply({
      content: '🚫 | Bạn phải ở trong một phòng Voice để sử dụng lệnh này !'
    });
    const queue = await client.distube.getQueue(VoiceChannel);
    if (queue && guild.members.me.voice.channelId && VoiceChannel.id !== guild.members.me.voice.channelId) return message.reply({
      content: `🚫 | Bạn phải ở cùng một phòng Voice để sử dụng lệnh này. Bài hát đang được phát tại ${guild.members.me.voice.channel}`
    });
    const queueId = args[1];
    if (!queueId) return message.reply({ content: "Vui lòng thêm playlist-id" });
    const data = await Playlist.get(queueId);
    if (!data) return message.reply({ content: 'Danh sách phát không tồn tại' });

    if (data.privacy === true) {
      const User = client.users.cache.get(data.userId);
      if (data.userId !== message.author.id) return message.reply({
        content: `Danh sách này ở chế độ private, chỉ có ${User.tag} mới sử dụng được.`
      });
      const songs = data.songs.url;
      const names = data.songs.name;
      if (!songs?.length) return message.reply({
        content: `Danh sách này trống. Vui lòng sử dụng "${prefix} playlist add" để thêm bài hát.`
      });
      const playlist = await client.distube.createCustomPlaylist(songs, {
        member,
        properties: { name: `${names}` },
        parallel: true,
      });
      await client.distube.play(VoiceChannel, playlist, {
        textChannel: channel,
        member,
      });
      return message.channel.send({
        embeds: [new EmbedBuilders({
          description: `✅ | Danh sách có ID: **${queueId}** đã được phát.`,
          colors: "Random"
        })]
      });
    } else {
      const songs = data.songs.url;
      const names = data.songs.name;
      if (songs.length === 0) return message.reply({
        content: 'Danh sách này trống. Vui lòng sử dụng `/playlist add` để thêm bài hát.'
      });
      const playlist = await client.distube.createCustomPlaylist(songs, {
        member,
        properties: { name: `${names}` },
        parallel: true,
      });
      await client.distube.play(VoiceChannel, playlist, {
        textChannel: channel,
        member,
      });
      return message.channel.send({
        embeds: [new EmbedBuilder({
          description: `✅ | Danh sách có ID: **${queueId}** đã được phát.`,
          colors: "Random"
        })]
      });
    };
  }
  else if (commandName === "remove") {
    const queueId = args[1];
    if (!queueId) return message.reply({ content: "Vui lòng thêm playlist-id" });
    const position = args[2];
    if (isNaN(position)) return message.reply({ content: `Giá trị bạn vừa nhập không phải là 1 con số` });
    const data = await Playlist.get(queueId);
    if (!data) return message.reply({ content: 'Danh sách phát này không tồn tại.' });
    if (data.userId !== message.author.id) return message.reply({
      content: 'Bạn chỉ có thể xóa các bài hát khỏi danh sách phát của riêng mình.'
    });

    const name = data.songs.name;
    const url = data.songs.url;

    const filtered = parseInt(position - 1);
    if (filtered > name.length - 1) return message.reply({
      content: 'Cung cấp vị trí bài hát hợp lệ, sử dụng `<prefix>playlist info` để kiểm tra tất cả các vị trí bài hát'
    });

    const opName = name.splice(filtered, 1).filter((x) => !name.includes(x));
    const opURL = url.splice(filtered, 1).filter((x) => !url.includes(x));

    await Playlist.set(queueId, data);

    return message.reply({
      embeds: [new EmbedBuilders({ timestamp: Date.now() })
        .setColor('#2a9454')
        .setDescription(`✅ | Đã xóa thành công **[${opName}](${opURL})** khỏi Danh sách phát`)
      ]
    });
  }
  else if (commandName === "editname") {
    const playlistId = args[1];
    if (!playlistId) return message.reply({ content: "Vui lòng thêm playlist-id" });
    const newName = args.slice(2).join(" ");
    if (!newName) return message.reply({ content: "Vui lòng thêm tên playlist mới của bạn" });
    const data = await Playlist.get(playlistId);
    if (!data) return message.reply({ content: "Playlist không tồn tại" });
    if (data.userId !== message.author.id) return message.reply({
      content: 'Bạn chỉ có thể xóa các bài hát khỏi danh sách phát của riêng mình.'
    });
    data.name = newName;
    await Playlist.set(playlistId, data);
    return message.reply({
      embeds: [new EmbedBuilders({
        title: { name: "Sửa tên playlist" },
        description: `Đã sửa tên playlist của bạn thành: ${newName}`,
        colors: "Random"
      })]
    });
  }
  else {
    return message.reply({
      embeds: [new EmbedBuilders({
        title: { name: "❌ Sai tên lệnh" },
        description: `
Tên lệnh: | Mô tả:
create      | tạo playlist 
list             | xem danh sách playlist
delete      | xoá playlist của bạn
add           | thêm bài hát vào playlist
info           | xem thông tin playlist
play          | phát nhạc trong playlist của bạn
        `,
        timestamp: Date.now(),
        colors: "Random"
      })]
    });
  };
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;