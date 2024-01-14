import { welcomeGoodbye } from "../Assets/Schemas/databases.js"
import { eventBuilders } from "../functions.js";

const welcome = new eventBuilders({
    eventCustomName: "welcome.js", // Tên sự kiện tùy chọn
    eventName: "guildMemberAdd", // tên sự kiện theo Discord.Events
    eventOnce: false, // khởi chạy 1 lần 
    executeEvents: async (client, member) => {
        const welcomeData = await welcomeGoodbye.get(member.guild.id);
        if (!welcomeData) return;
        const channels = member.guild.channels.cache.find((channel) => {
            return channel.id === welcomeData.WelcomeChannel;
        });
        if (!channels) return;
        channels.send({
            content: `chào mừng <@${member.user.id}> đã đến với ${member.guild.name}`
        });
    },
});

export default welcome;