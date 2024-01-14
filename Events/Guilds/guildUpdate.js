import { eventBuilders, EmbedBuilders } from "../functions.js";
import { channelSchema } from "../Assets/Schemas/databases.js";

const guildUpdate = new eventBuilders({
    eventCustomName: "guildUpdate.js", // Tên sự kiện tùy chọn
    eventName: "guildUpdate", // tên sự kiện theo Discord.Events
    eventOnce: false, // khởi chạy 1 lần 
    executeEvents: async (client, channel) => {
        const getData = await channelSchema.get(channel.guild.id);
        if (!getData) return;
        const channels = channel.guild.channels.cache.find((_channel) => {
            return _channel.id === getData.channelDelete;
        });
        if (!channels) return;
        if (newGuild.name !== oldGuild.name) {
            return channels.send({
                embeds: [new EmbedBuilders
                    .setColor("Yellow")
                    .setTitle("Server Updates")
                    .addFields({ name: 'Tên Server đã thay đổi', value: `${oldGuild.name} => ${newGuild.name}` })
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .setTimestamp()
                ]
            });
        } else if (newGuild.iconURL() !== oldGuild.iconURL()) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setColor("Yellow")
                    .setTitle("Server Updates")
                    .addFields('Avatar của server đã thay đổi', `[Avatar cũ](${oldGuild.iconURL()}) => [Avatar mới](${newGuild.iconURL()})`)
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .setTimestamp()
                ]
            });
        } else if (newGuild.splashURL() !== oldGuild.splashURL()) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setColor("Yellow")
                    .setTitle("Server Updates")
                    .addFields({ name: "Máy chủ Splash đã thay đổi", value: `[Splash cũ](${oldGuild.splashURL()}) => [Splash mới](${newGuild.splashURL()})` })
                    .setThumbnail(`${newGuild.splashURL()}`)
                    .setTimestamp()
                ]
            });
        } else if (newGuild.memberCount !== oldGuild.memberCount) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setColor("Yellow")
                    .setTitle("Server Updates")
                    .addFields({ name: 'Thành viên server đã thay đổi', value: `${oldGuild.memberCount} => ${newGuild.memberCount}` })
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .setTimestamp()
                ]
            });
        } else if (newGuild.ownerId !== oldGuild.ownerId) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setColor("Yellow")
                    .setTitle("Server Updates")
                    .addFields({ name: 'Chủ sở hữu server đã thay đổi', value: `${oldGuild.owner.user.username} => ${newGuild.owner.user.username}` })
                    .setThumbnail(`${newGuild.iconURL()}`)
                    .setTimestamp()
                ]
            });
        } else {
            return channels.send({
                content: "Đã sảy ra lỗi trong quá trình thực thi kết quả"
            });
        };
    },
});

export default guildUpdate;