import { music as musicDB, channelSchema } from "../Assets/Schemas/databases.js";
import { eventBuilders } from "../functions.js";

const createSchemas = new eventBuilders({
  eventCustomName: "createSchema.js",
  eventName: "ready",
  eventOnce: false,
  executeEvents: async (client) => {
    client.guilds.cache.forEach(async (guild) => {
      if (!await channelSchema.has(guild.id)) return channelSchema.set(guild.id, {
        GuildId: guild.id,
        GuildName: guild.name,
        // create voice
        ChannelAutoCreateVoice: "",
        // voice
        voiceStateUpdate: "",
        // channel
        channelCreate: "",
        channelDelete: "",
        channelUpdate: "",
        // Guild
        guildMemberUpdate: "",
        guildCreate: "",
        guildDelete: "",
        guildUpdate: ""
      });
    });
    // tìm kiếm và tạo database cho miusic nếu nó chưa được tạo trước đó
    client.guilds.cache.forEach(async (guild) => {
      if (!await musicDB.has(guild.id)) return musicDB.set(guild.id, {
        GuildId: guild.id,
        GuildName: guild.name,
        DefaultAutoresume: Boolean(false),
        DefaultAutoplay: Boolean(false),
        DefaultVolume: 50,
        DefaultFilters: ['bassboost'],
        MessageId: "",
        ChannelId: "",
        Djroles: []
      });
    });
  },
});

export default createSchemas;