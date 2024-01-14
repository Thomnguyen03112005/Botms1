import { commandBuilders, EmbedBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
    name: path.parse(__filename).name, // Tên Lệnh chính
    usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
    category: path.parse(__dirname).name, // thể loại lệnh
    aliases: [], // lệnh phụ
    description: "Phát nhạc theo yêu cầu", // mô tả dành cho lệnh
    cooldown: 5, // thời gian hồi lệnh
    owner: false, // bật tắt chế độ dev
    permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async(client, message, args, prefix) => {
    const VoiceChannel = message.member.voice.channel;
    if (!VoiceChannel) return message.reply({ content: "Bạn chưa tham gia kênh voice" });
    const Text = args.join(" ");
    await message.react('🔍');
    if (!Text) return message.channel.send(`Vui lòng nhập url bài hát hoặc truy vấn để tìm kiếm.`);
    let newmsg = await message.reply({
        content: ` Đang tìm kiếm bài hát:  \`\`\`${Text}\`\`\``,
    }).catch((e) => console.log(e));
    client.distube.play(VoiceChannel, Text, {
        member: message.member,
        textChannel: message.channel,
        message
    });
    let queue = client.distube.getQueue(message.guildId);
    newmsg.edit({ content: `${queue?.songs?.length > 0 ? "👍 Thêm" : "🎶 Đang phát"}: \`\`\`css\n${Text}\n\`\`\`` }).catch((e) => console.log(e));
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;