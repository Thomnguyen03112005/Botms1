import Discord, { EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } from "discord.js";
import { eventBuilders } from "../functions.js";

const sendMessage = new eventBuilders({
  eventCustomName: "sendMessage", // Tên events tùy chỉnh
  eventName: "guildCreate", // tên events
  eventOnce: false, // bật lên nếu chỉ thực hiện nó 1 lần
  executeEvents: async (client, guild) => {
    const guilds = await guild.channels.cache.find((channels) => channels.type === ChannelType.GuildText && channels.permissionsFor(guild.members.me).has(PermissionFlagsBits.CreateInstantInvite && PermissionFlagsBits.SendMessages));
    guilds.send({
      embeds: [new EmbedBuilder()
        .setAuthor({ name: guild.name, url: "https://discord.gg/tSTY36dPWa" })
        .setThumbnail("https://i.pinimg.com/originals/3f/2c/10/3f2c1007b4c8d3de7d4ea81b61008ca1.gif")
        .setColor("Random")
        .setTimestamp()
        .setDescription(`✨ ${client.config.prefix}help để xem tất cả các lệnh`)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      ], components: [new ActionRowBuilder().addComponents([
        new ButtonBuilder().setCustomId('inviteBot').setLabel('Mời bot').setStyle("Primary").setEmoji('🗿'),
        new ButtonBuilder().setCustomId('inviteDiscord').setLabel('Vào Discord').setStyle("Primary").setEmoji('🏡')
      ])]
    }).catch((e) => console.log(`guildCreate: ${e}`));
    // 
    client.on("interactionCreate", (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === "inviteBot") {
          interaction.reply({ content: `[Bấm vào đây](${client.config.discordBot})` }).then(() => {
            setTimeout(() => interaction.deleteReply(), 5000);
          }).catch(() => { });
        } else if (interaction.customId === "inviteDiscord") {
          interaction.reply({ content: `[Bấm vào đây](${client.config.discord})` }).then(() => {
            setTimeout(() => interaction.deleteReply(), 5000);
          }).catch(() => { });
        };
      };
    });
  },
});

export default sendMessage;