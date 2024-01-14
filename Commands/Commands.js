/*========================================================
# Commands
========================================================*/
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
  description: "", // mô tả dành cho lệnh
  cooldown: 5, // thời gian hồi lệnh
  owner: false, // bật tắt chế độ dev
  permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
  // code
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;
/*========================================================
# slashCommands
========================================================*/
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { slashCommandBuilder } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";
// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
  name: path.parse(fileURLToPath(import.meta.url)).name, // Tên lệnh, có thể viết hoa hoặc chữ thường theo sở thích
  description: "", // Mô tả lệnh
  userPerms: [], // quyền của thành viên có thể sử dụng lệnh
  owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
  cooldown: 3, // thời gian hồi lệnh
  type: "",
  options: []
}).addSlashCommand((client, interaction) => {
  // code
});
// console.log(slashCommand.toJSON());
export default slashCommand;
/*========================================================
# modules 
========================================================*/
import { fileURLToPath } from 'node:url';
import path from "node:path";

const moduleEvent = (client) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const description = {
    name: path.parse(__filename).name,
    filename: path.parse(__filename).name,
    version: "5.0"
  };
  console.log(` :: ⬜️ modules: ${description.name} | Phiên bản đã tải ${description.version} Từ ("${description.filename}")`);
  // code
};

export default moduleEvent;
/*========================================================
# Events
========================================================*/
const events = new eventBuilders({
  eventCustomName: "name custom", // Tên events tùy chỉnh
  eventName: "", // tên events
  eventOnce: false, // bật lên nếu chỉ thực hiện nó 1 lần
  executeEvents: async (client) => {
    // code
  },
});
/*========================================================
# 
========================================================*/
