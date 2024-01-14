import { EmbedBuilders, eventBuilders } from "../functions.js";
import { channelSchema } from "../Assets/Schemas/databases.js";
const voiceStateUpdate = new eventBuilders({
    eventCustomName: "voiceStateUpdate.js", // Tên sự kiện tùy chọn
    eventName: "voiceStateUpdate", // tên sự kiện theo Discord.Events
    eventOnce: false, // khởi chạy 1 lần 
    executeEvents: async (client, oldState, newState) => {
        const getData = await channelSchema.get(oldState.guild.id);
        if (!getData) return;
        const channels = oldState.guild.channels.cache.find((channel) => {
            return channel.id === getData.channelDelete;
        });
        if (!channels) return;
        let oldUser = oldState.member;
        let newUser = newState.member;
        if (oldUser.voice.channelId !== newUser.voice.channelId && newUser.voice.channelId !== null || undefined) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle("Voice State Updates")
                    .setDescription(`${newUser} đã tham gia kênh voice <#${newUser.voice.channelId}>`)
                    .setColor("Yellow")
                    .setTimestamp()
                ]
            }).catch((ex) => console.log(ex));
        } else if (oldUser.voice.channelId !== newUser.voice.channelId && newUser.voice.channelId === null || undefined) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle("Voice State Updates")
                    .setDescription(`${newUser} rời khỏi kênh voice <#${oldUser.voice.channelId}>`)
                    .setColor("Yellow")
                    .setTimestamp()
                ]
            }).catch((ex) => console.log(ex));
        } else if (oldState.mute !== newState.mute) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle("Voice State Updates")
                    .setDescription(`${newUser} đã ${newState.mute ? "tắt tiếng" : "bật tiếng"}`)
                    .setColor("Yellow")
                    .setTimestamp()
                ]
            }).catch((ex) => console.log(ex));
        } else if (oldState.deaf !== newState.deaf) {
            return channels.send({
                embeds: [new EmbedBuilders()
                    .setTitle("Voice State Updates")
                    .setDescription(`${newUser} đã ${newState.deaf ? "tắt âm thanh" : "bật âm thanh"}`)
                    .setColor("Yellow")
                    .setTimestamp()
                ]
            }).catch((ex) => console.log(ex));
        };
    },
});

export default voiceStateUpdate;