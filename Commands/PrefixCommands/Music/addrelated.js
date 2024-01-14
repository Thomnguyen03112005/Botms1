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
  description: "🔍 Tìm kiếm bài hát liên quan", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  const VoiceChannel = message.member.voice.channel;
	if (!VoiceChannel) return message.reply({ content: "Bạn chưa tham gia kênh voice" });
	let newQueue = client.distube.getQueue(message.guildId);
	if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
		embeds: [new EmbedBuilders().setColor("Random").setTitle("Danh sách nhạc trống")],
	});
	let thenewmsg = await message.reply({
		content: `🔍 Tìm kiếm bài hát liên quan cho... **${newQueue.songs[0].name}**`,
	}).catch((e) => console.log(e));
	await newQueue.addRelatedSong();
	await thenewmsg.edit({
		content: `👍 Đã thêm: **${newQueue.songs[newQueue.songs.length - 1].name}**`,
	}).catch((e) => {
		console.log(e);
	});
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;