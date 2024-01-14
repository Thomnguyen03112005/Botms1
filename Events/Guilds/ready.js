import { eventBuilders } from "../functions.js";
import { ActivityType, Events } from "discord.js";
import colors from "chalk";

const ready = new eventBuilders({
  eventCustomName: "ready.js",
  eventName: Events.ClientReady,
  eventOnce: false,
  executeEvents: async(client) => {
    console.log(colors.yellow(`${client.user.username} đã sẵn sàng hoạt động`));
    // hiển thị trạng thái bot
    const setActivities = [
      `${client.guilds.cache.size} Guilds, ${client.guilds.cache.map(c => c.memberCount).filter((v) => typeof v === "number").reduce((a, b) => a + b, 0)} member`,
      `BlackCat-Club`,
      `${client.config.prefix}help`
    ];
    setInterval(() => {
      client.user.setPresence({
        activities: [{ name: setActivities[Math.floor(Math.random() * setActivities.length)], type: ActivityType.Playing }],
        status: 'dnd',
      });
    }, 5000);
  },
});

export default ready;