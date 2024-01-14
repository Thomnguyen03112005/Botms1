import Discord, { EmbedBuilder, PermissionsBitField, InteractionType } from "discord.js";
import { eventBuilders } from "../functions.js";
import colors from 'chalk';

const interactionCreate = new eventBuilders({
  eventCustomName: "interactionCreate.js", // Tên sự kiện tùy chọn
  eventName: "interactionCreate", // tên sự kiện theo Discord.Events
  eventOnce: false, // khởi chạy 1 lần 
  executeEvents: async (client, interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
      if (!client.slashCommands.has(interaction.commandName) || interaction.user.bot || !interaction.guild) return;
      const SlashCommands = client.slashCommands.get(interaction.commandName);
      if (!SlashCommands) return;
      if (SlashCommands) {
        try {
          const embed = new EmbedBuilder().setTitle("Thiếu quyền sử dụng lệnh").setColor("Random");
          // dev commands
          if (SlashCommands.owner && client.config.developer.includes(interaction.user.id)) return interaction.reply({
            content: "Tôi, không phải là bot ngu ngốc, chỉ chủ sở hữu mới có thể sử dụng lệnh này"
          });
          // Các quyền của thành viên
          if (SlashCommands.userPerms) {
            if (!interaction.member.permissions.has(PermissionsBitField.resolve(SlashCommands.userPerms || []))) return interaction.reply({
              embeds: [embed.setDescription(`Xin lỗi, bạn không có quyền ${SlashCommands.userPerms} trong <#${interaction.channelId}> để sử dụng lệnh ${SlashCommands.name} này`)]
            });
          };
          SlashCommands.run(client, interaction);
        } catch (error) {
          if (interaction.replied) return await interaction.editReplyinteraction.editReply({
            embeds: [new EmbedBuilder().setDescription("Đã xảy ra lỗi khi thực hiện lệnh, xin lỗi vì sự bất tiện <3")],
            ephemeral: true,
          });
          console.log(error);
        };
      };
    };
  },
});

export default interactionCreate;