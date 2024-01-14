import Discord, { Events } from "discord.js";
import { afkSchema } from "../Assets/Schemas/databases.js"
import { eventBuilders } from "../functions.js";

const afkEvent = new eventBuilders({
    eventCustomName: "afk.js", // Tên sự kiện tùy chọn
    eventName: Events.MessageCreate, // tên events
    eventOnce: false, // bật lên nếu chỉ thực hiện nó 1 lần
    executeEvents: async (client, message) => {
        if (message.author.bot) return;
        const afkcheck = await afkSchema.get(message.guild.id);
        if (afkcheck) {
            const nick = afkcheck.Nickname;
            await afkSchema.delete(message.guild.id);
            await message.member.setNickname(`${nick}`).catch((err) => {
                return console.log("Thiếu quyền");
            });
            const m1 = await message.reply({ content: `Này, bạn đã ** trở lại **!`, ephemeral: true });
            setTimeout(() => {
                m1.delete();
            }, 10000);
        } else {
            const members = message.mentions.users.first();
            if (!members) return;
            const afkData = await afkSchema.get(message.guild.id);
            if (!afkData) return;
            const member = message.guild.members.cache.get(members.id);
            const msg = afkData.Message;
            if (message.content.includes(members)) {
                const m = await message.reply({ content: `${member.user.tag} hiện đang AFK\n> **Lý do**: ${msg}`, ephemeral: true });
                setTimeout(() => {
                    m.delete();
                    message.delete();
                }, 10000);
            };
        };
    },
});

export default afkEvent;