import { EmbedBuilders, eventBuilders } from "../functions.js";
import { channelSchema } from "../Assets/Schemas/databases.js";

const guildMemberUpdate = new eventBuilders({
    eventCustomName: "guildMemberUpdate.js", // Tên sự kiện tùy chọn
    eventName: "guildMemberUpdate", // tên sự kiện theo Discord.Events
    eventOnce: false, // khởi chạy 1 lần 
    executeEvents: async (client, oldMember, newMember) => {
        const getData = await channelSchema.get(oldMember.guild.id);
        if (!getData) return;
        const channels = oldMember.guild.channels.cache.find((channel) => {
            return channel.id === getData.guildMemberUpdate;
        });
        if (!channels) return;
        if (newMember.nickname !== oldMember.nickname) {
            let oldNickname = oldMember.nickname ? oldMember.nickname : oldMember.user.username;
            let newNickname = newMember.nickname ? newMember.nickname : newMember.user.username;
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle(`${newMember.user.tag}`)
                    .addFields({ name: 'Biệt danh thành viên đã thay đổi', value: `${oldNickname} => ${newNickname}` })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setThumbnail(`${newMember.user.avatarURL()}`)
                ]
            });
        } else if (newMember.user.username !== oldMember.user.username) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle(`${newMember.user.tag}`)
                    .addFields({ name: 'Tên thành viên đã thay đổi', value: `${oldMember.user.username} => ${newMember.user.username}` })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setThumbnail(`${newMember.user.avatarURL()}`)
                ]
            });
        } else if (newMember.user.avatarURL() !== oldMember.user.avatarURL()) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle(`${newMember.user.tag}`)
                    .addFields({ name: 'Hình đại diện thành viên đã thay đổi', value: `${oldMember.user.avatarURL()} => ${newMember.user.avatarURL()}` })
                    .setColor("Yellow")
                    .setTimestamp()
                    .setThumbnail(`${newMember.user.avatarURL()}`)
                ]
            });
        } else {
            return channels.send({
                content: "[guildMemberUpdate] Đã sảy ra lỗi trong quá trình thực thi kết quả"
            });
        };
    },
});

export default guildMemberUpdate;