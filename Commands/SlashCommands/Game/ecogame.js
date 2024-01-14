import { ApplicationCommandOptionType, ActionRowBuilder, ComponentType, ApplicationCommandType } from "discord.js";
import { slashCommandBuilder, EmbedBuilders, classComponent } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
  name: path.parse(fileURLToPath(import.meta.url)).name, // Tên lệnh 
  description: "Chơi game để kiếm tiền", // Mô tả lệnh
  userPerms: [], // quyền của thành viên có thể sử dụng lệnh
  owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
  cooldown: 3, // thời gian hồi lệnh
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "scratch",
      description: "Chơi game cào thưởng",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "number",
        description: "nhập số tiền bạn muốn chơi",
        type: ApplicationCommandOptionType.Number,
        required: true,
      }],
    },
    {
      name: "slot",
      description: "Chơi game slottt",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: "number",
        description: "nhập số tiền bạn muốn chơi",
        type: ApplicationCommandOptionType.Number,
        required: true,
      }],
    }
  ]
}).addSlashCommand(async (client, interaction) => {
  const clss = new classComponent();
  let subCommands = interaction.options.getSubcommand(); // nhận lệnh phụ
  let checkMoney = new EmbedBuilders({ title: { name: "Đã sảy ra lỗi" }, colors: "Random" });
  if(subCommands === "scratch") {
    let moneyNumber = interaction.options.getNumber("number");
    let user = await client.cs.balance({ user: interaction.member });
    if (moneyNumber > user.wallet) return interaction.reply({ embeds: [checkMoney.setDescription("Bạn không có nhiều tiền trong ví của mình")] });
    if (moneyNumber < 1) return interaction.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số cao hơn \`1\`")] });
    //if(moneyNumber > 30000) return message.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số nhỏ hơn \`30.000\`")]});
    await client.cs.removeMoney({ user: interaction.member, amount: moneyNumber });
    let clicks = 3;
    let options = {
      ic: '💷',
      jc: '🪙'
    };
    let positions = [
      {
        r: { custom_id: "r1", emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, disabled: true },
        a: { label: `-`, style: clss.toButtonStyle("Secondary"), type: ComponentType.Button, custom_id: 'a1' }
      },
      {
        r: { custom_id: "r2", label: "-", style: clss.toButtonStyle("Danger"), disabled: true, type: ComponentType.Button, },
        a: { custom_id: "a2", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button, }
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r3", disabled: true },
        a: { custom_id: "a3", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button, },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r4", disabled: true },
        a: { custom_id: "a4", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button, },
      },
      {
        r: { emoji: { name: `${options.jc}` }, style: clss.toButtonStyle("Primary"), type: ComponentType.Button, custom_id: "r5", disabled: true },
        a: { custom_id: "a5", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { label: "-", style: clss.toButtonStyle("Danger"), type: ComponentType.Button, custom_id: "r6", disabled: true },
        a: { custom_id: "a6", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r7", disabled: true },
        a: { custom_id: "a7", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { label: "-", style: clss.toButtonStyle("Danger"), type: ComponentType.Button, custom_id: "r8", disabled: true },
        a: { custom_id: "a8", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { label: "-", style: clss.toButtonStyle("Danger"), type: ComponentType.Button, custom_id: "r9", disabled: true },
        a: { custom_id: "a9", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button, },
      },
      {
        r: { label: "-", style: clss.toButtonStyle("Danger"), type: ComponentType.Button, custom_id: "r10", disabled: true },
        a: { custom_id: "a10", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { label: "-", style: clss.toButtonStyle("Danger"), type: ComponentType.Button, custom_id: "r11", disabled: true },
        a: { custom_id: "a11", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r12", disabled: true },
        a: { custom_id: "a12", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r13", disabled: true },
        a: { custom_id: "a13", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r14", disabled: true },
        a: { custom_id: "a14", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
      {
        r: { emoji: { name: `${options.ic}` }, style: clss.toButtonStyle("Success"), type: ComponentType.Button, custom_id: "r15", disabled: true },
        a: { custom_id: "a15", label: "-", style: clss.toButtonStyle("Secondary"), type: ComponentType.Button },
      },
    ];
    function shuffle(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      };
      return array;
    };
    positions = shuffle(positions);
    let row1 = new ActionRowBuilder({ components: [positions[0].a, positions[1].a, positions[2].a] });
    let row2 = new ActionRowBuilder({ components: [positions[3].a, positions[4].a, positions[5].a] });
    let row3 = new ActionRowBuilder({ components: [positions[6].a, positions[7].a, positions[8].a] });
    let row4 = new ActionRowBuilder({ components: [positions[9].a, positions[10].a, positions[11].a] });
    let row5 = new ActionRowBuilder({ components: [positions[12].a, positions[13].a, positions[14].a] });
    let embed = new EmbedBuilders({
      description: `Tiền cược: **${moneyNumber.toLocaleString()}₫**\nBạn còn: **${clicks}** lượt cào số.`,
      title: { name: `${interaction.member.displayName} kiếp đỏ đen` },
      timestamp: Date.now(),
      colors: "Random"
    });
    let msg = await interaction.reply({ embeds: [embed], components: [row1, row2, row3, row4, row5] })
    let collector = msg.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      filter: (i) => i.user.id === interaction.member.id,
      time: 120000,
      max: 3
    });
    collector.on('collect', async (i) => {
      if (!i.isButton()) return;
      i.deferUpdate();
      let used = positions.find((x) => x.a.custom_id === i.customId);
      if (used.r.style === clss.toButtonStyle("Danger")) {
        let moneylost = moneyNumber * 0.25;
        moneyNumber -= Math.trunc(moneylost);
        clicks -= 1;
      } else if (used.r.style === clss.toButtonStyle("Success")) {
        let moneywon = moneyNumber * 0.09;
        moneyNumber += Math.trunc(moneywon);
        clicks -= 1;
      } else if (used.r.style === clss.toButtonStyle("Primary")) {
        let moneyjackpot = moneyNumber * 8.99;
        moneyNumber += moneyjackpot;
        clicks -= 1;
      };
      used.a = used.r;
      embed = new EmbedBuilders({
        description: `Tiền thắng: **${moneyNumber.toLocaleString()}₫ ** \nBạn có: **${clicks}** lần cào nữa.`,
        title: { name: `${interaction.member.displayName} kiếp đỏ đen` },
        timestamp: Date.now(),
        colors: "Random"
      });
      msg.edit({
        embeds: [embed],
        components: [
          new ActionRowBuilder({ components: [positions[0].a, positions[1].a, positions[2].a] }),
          new ActionRowBuilder({ components: [positions[3].a, positions[4].a, positions[5].a] }),
          new ActionRowBuilder({ components: [positions[6].a, positions[7].a, positions[8].a] }),
          new ActionRowBuilder({ components: [positions[9].a, positions[10].a, positions[11].a] }),
          new ActionRowBuilder({ components: [positions[12].a, positions[13].a, positions[14].a] }),
        ]
      });
    });
    collector.on('end', async () => {
      positions.forEach((g) => {
        g.a = g.r;
        row1 = new ActionRowBuilder({ components: [positions[0].a, positions[1].a, positions[2].a] });
        row2 = new ActionRowBuilder({ components: [positions[3].a, positions[4].a, positions[5].a] });
        row3 = new ActionRowBuilder({ components: [positions[6].a, positions[7].a, positions[8].a] });
        row4 = new ActionRowBuilder({ components: [positions[9].a, positions[10].a, positions[11].a] });
        row5 = new ActionRowBuilder({ components: [positions[12].a, positions[13].a, positions[14].a] });
      });
      const money = (`${Math.trunc(moneyNumber)}`);
      await client.cs.addMoney({ user: interaction.member.id, amount: money });
      embed = new EmbedBuilders({
        description: `Bạn đã cào được: **${moneyNumber.toLocaleString()}₫ **\nBạn đã nhận được: **${money.toString()}**`,
        title: { name: `${interaction.member.username} kiếp đỏ đen` },
        timestamp: Date.now(),
        colors: "Random"
      });
      msg.edit({ embeds: [embed], components: [row1, row2, row3, row4, row5] });
    });
  }
  else if(subCommands === "slot") {
    let moneyEarned = interaction.options.getNumber("number");
    let user = await client.cs.balance({ user: interaction.member });
    if (moneyEarned > user.wallet) return interaction.reply({ embeds: [checkMoney.setDescription("Bạn không có nhiều tiền trong ví của mình")] });
    if (moneyEarned < 1) return interaction.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số cao hơn \`1\`")] });
    if (moneyEarned > 30000) return interaction.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số nhỏ hơn \`30.000\`")] });
    const slotemoji = ":money_mouth:";
    let items = ['💵', '💍', '💯'];
    let $ = items[Math.floor(items.length * Math.random())];
    let $$ = items[Math.floor(items.length * Math.random())];
    let $$$ = items[Math.floor(items.length * Math.random())];
    let spinner = await interaction.reply({ content: "• " + slotemoji + "  " + slotemoji + "  " + slotemoji + " •" })
    setTimeout(() => {
      spinner.edit({ content: "• " + $ + "  " + slotemoji + "  " + slotemoji + " •" });
    }, 600);
    setTimeout(() => {
      spinner.edit({ content: "• " + $ + "  " + $$ + "  " + slotemoji + " •" });
    }, 1200);
    setTimeout(() => {
      spinner.edit({ content: "• " + $ + "  " + $$ + "  " + $$$ + " •" });
    }, 1800);
    if ($ === $$ && $ === $$$) {
      await client.cs.addMoney({
        user: interaction.member, // mention
        amount: moneyEarned * 2 - 0.5,
        wheretoPutMoney: "wallet"
      });
      setTimeout(async () => {
        interaction.editReply({ content: `${interaction.member.displayName} bạn đã thắng và bạn được cộng ${moneyEarned * 2} tiền` });
      }, 3000);
    } else if ($$ !== $ && $$ !== $$$) {
      await client.cs.removeMoney({
        user: interaction.member,
        amount: moneyEarned,
        wheretoPutMoney: "wallet",
      });
      setTimeout(async () => {
        interaction.editReply({ content: `${interaction.member.displayName} bạn đã thua sml và bạn đã mất ${moneyEarned} tiền` });
      }, 3000);
    } else if($ !== $$ && $$ !== $$$) {
      await client.cs.removeMoney({
        user: interaction.member,
        amount: moneyEarned,
        wheretoPutMoney: "wallet",
      });
      setTimeout(async () => {
        interaction.editReply({ content: `${interaction.member.displayName} bạn đã thua sml và bạn đã mất ${moneyEarned} tiền` });
      }, 3000);
    };
  }
  else if(subCommands === "test") {
    return;
  };
});

// console.log(slashCommand.toJSON());
export default slashCommand;