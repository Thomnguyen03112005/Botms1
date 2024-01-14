/**
 * Test hệ thống ranking...
 */
import { setupDefault } from "../Events/Assets/Schemas/databases.js";
import LevelUp from "../Events/CanvasImg/levelUp.js";
import Levels from "../Events/Functions/ranking.js";
import Card from "../Events/CanvasImg/canvasCrad.js";
import { Events, AttachmentBuilder } from "discord.js";

export default function testCommand(client) {

    Levels.setURL(process.env.mongourl || client.config.mongourl);

    client.on(Events.MessageCreate, async (message) => {
        if (!message.guild || message.author.bot) return;

        const setupRank = await setupDefault.get(message.guild.id);

        if (!setupRank) return await setupDefault.set(message.guild.id, {
            GuildName: message.guild.name,
            ranking: Boolean(false), 
        });

        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, Math.floor(Math.random() * 29) + 1); // nhỏ nhất là 1 và cao nhất là 30

        if (setupRank.ranking === Boolean(true)) {
            if (hasLeveledUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);
                const levelUp = new LevelUp()
                    .setAvatar(message.author.displayAvatarURL({ extension: "png", size: 1024 }))
                    .setBackground("image", "https://vuagiasu.edu.vn/ve-tranh-phong-canh-anime/imager_5_4032_700.jpg")
                    .setUsername(message.author.username)
                    .setBorder("#000000")
                    .setAvatarBorder("#043a92")
                    .setOverlayOpacity(0.7)
                    .setLevels(user.level - 1, user.level);
                return message.reply({
                    files: [{
                        attachment: await levelUp.build(),
                        name: `levelup.png`
                    }]
                });
            };
        } else if(message.content === "setuprank") {
            const togglerank = await setupDefault.get(message.guild.id);
            if(!togglerank) return;
            togglerank.ranking = Boolean(true);
            await setupDefault.set(message.guild.id, togglerank);
            return message.reply({ content: "Đã thiết lập thành hệ thống thông báo rank thành " + togglerank.ranking });
        } else if (message.content === "ranks") {
            const memberId = message.author.id;
            const memberStatus = await message.guild.members.cache.get(memberId).presence;
            // const memberTag = await message.guild.members.fetch(memberId).tag;
            const user = await Levels.fetch(memberId, message.guild.id, true); // Chọn mục tiêu từ cơ sở dữ liệu.

            const welcome = new Card(memberId, {
                presenceStatus: memberStatus ? memberStatus.status : "invisible", // Trạng thái người dùng sẽ được hiển thị bên dưới hình đại diện
                customBackground: "https://vuagiasu.edu.vn/ve-tranh-phong-canh-anime/imager_5_4032_700.jpg", // Thay đổi nền thành bất kỳ hình ảnh nào (đường dẫn và URL) (885x303)
                usernameColor: '#ffbddf', // màu tên 
                borderColor: ["#2b7cff", "#043a92"], // màu bo viền sung quanh
                squareAvatar: Boolean(false), // bật nếu muốn bo vuông ảnh đại diện
                badgesFrame: Boolean(true), // Tạo một khung nhỏ phía sau huy hiệu
                rankData: {
                    currentXp: user.xp,
                    requiredXp: Levels.xpFor(user.level + 1),
                    rank: user.position,
                    level: user.level,
                    barColor: "#e3a520"
                }
            });

            const attachment = new AttachmentBuilder(await welcome.build(), {
                name: `rankcard-${message.author.id}.png`
            });

            return message.reply({ files: [attachment] });
        };
    });
};