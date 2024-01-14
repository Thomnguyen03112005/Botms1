import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import profileImage from "../../../Events/CanvasImg/canvasCrad.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
  name: path.parse(__filename).name, // Tên Lệnh chính
  usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
  category: path.parse(__dirname).name, // thể loại lệnh
  aliases: ["uinfo"], // lệnh phụ
  description: "Hiển thị thông tin có sẵn về thành viên đã nêu.", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const statusType = {
    idle: '1FJj7pX.png',
    dnd: 'fbLqSYv.png',
    online: 'JhW7v9d.png',
    invisible: 'dibKqth.png',
  };
  
  const activityType = [
    '🕹 *Playing*',
    '🎙 *Streaming*',
    '🎧 *Listening to*',
    '📺 *Watching*',
    '🤹🏻‍♀️ *Custom*',
    '🏆 *Competing in*',
  ];

  const clientType = [
    { name: 'desktop', text: 'Computer', emoji: '💻' },
    { name: 'mobile', text: 'Phone', emoji: '🤳🏻' },
    { name: 'web', text: 'Website', emoji: '🌍' },
    { name: 'offline', text: 'Offline', emoji: '💤' },
  ];

  const badges = {
    BugHunterLevel1: '<:bugHunterLogo:1102127658311102476>',
    BugHunterLevel2: '<:goldBugHunterLogo:1102128374811480124>',
    CertifiedModerator: 'Certified Moderator',
    HypeSquadOnlineHouse1: 'Hypesquad Bravery',
    HypeSquadOnlineHouse2: 'Hypesquad Brilliance',
    HypeSquadOnlineHouse3: 'Hypesquad Balance',
    Hypesquad: 'Hypesquad Event Attendee',
    Partner: 'Discord Partner',
    PremiumEarlySupporter: 'Nitro Early Supporter',
    Staff: 'Discord Staff',
    VerifiedBot: 'Verified Bot',
    VerifiedDeveloper: 'Verified Bot Developer',
    ActiveDeveloper: 'Active Developer',
  };
  
  const msg = await message.reply({ content: "Đang lấy thông tin của thành viên ...", embeds: [] });
  const mentions = message.mentions.users.first() || message.author;
  const memberStatus = message.guild.members.cache.get(mentions.id).presence.status;
  const fetchedMembers = await message.guild.members.fetch();
  // const joinPosition = Array.from(fetchedMembers.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).keys()).indexOf(mentions.id) + 1;
  // const userFlags = mentions.user.flags.toArray();
  // const sortedRoles = mentions.roles.cache.map((role) => role).sort((a, b) => b.position - a.position).slice(0, roles.cache.size - 1);
  // const clientStatus = mentions.presence?.clientStatus instanceof Object ? Object.keys(mentions.presence.clientStatus) : 'offline';
  // const deviceFilter = clientType.filter((device) => clientStatus.includes(device.name));
  // const devices = !Array.isArray(deviceFilter) ? new Array(deviceFilter) : deviceFilter;

  const formatter = new Intl.ListFormat('vi-VN', {
    style: 'narrow',
    type: 'conjunction',
  });
  const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];
      for (const role of roles) {
        const roleString = `<@&${role.id}>`;
        if (roleString.length + totalLength > maxFieldLength) break;
        totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
        result.push(roleString);
      };
      return result.length;
  };
  
  const profileBuffer = new profileImage(message.author.id, {
    borderColor: ['#f90257', '#043a92'],
    usernameColor: "#f90257",
    presenceStatus: memberStatus,
  });
  
  msg.edit({
    content: "",
    embeds: [new EmbedBuilders({
      author: { name: "blackcat", iconURL: `https://i.imgur.com/${statusType[memberStatus || 'invisible']}` },
      description: `Thông tin của ${mentions.username}`,
      images: "attachment://profile.png",
      colors: "Random",
      // fields: [
      //   { name: "Activities", value: memberStatus?.activities.map((activity) => `${activityType[activity.type]} ${activity.name}`).join('\n') || "Không có" }
      // ],
    })], 
    files: [{
      attachment: await profileBuffer.build(),
      name: "profile.png"
    }]
  });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;