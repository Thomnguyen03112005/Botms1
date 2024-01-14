import { commandBuilders, EmbedBuilders, classComponent } from "../../../Events/functions.js";
import { ActionRowBuilder, ComponentType } from "discord.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
    name: path.parse(__filename).name, // Tên Lệnh chính
    usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
    category: path.parse(__dirname).name, // thể loại lệnh
    aliases: ["vecao", "soso"], // lệnh phụ
    description: "chơi game cào bài trúng thưởng", // mô tả dành cho lệnh
    cooldown: 5, // thời gian hồi lệnh
    owner: false, // bật tắt chế độ dev
    permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    const clss = new classComponent(); 
    let user = await client.cs.balance({
        user: message.author
    });
    const checkMoney = new EmbedBuilders({
        description: `Sử dụng lệnh không hợp lệ\nVui lòng sử dụng ${prefix + path.parse(__filename).name} <Số tiền>`,
        timestamp: Date.now(),
        colors: "Random"
    });
    let moneyEarned = parseInt(args[0]);
    if (moneyEarned > user.wallet) return message.reply({ embeds: [checkMoney.setDescription("Bạn không có nhiều tiền trong ví của mình")] });
    if (!moneyEarned) return message.reply({ embeds: [checkMoney] });
    if (moneyEarned < 1) return message.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số cao hơn \`1\`")] });
    //if(moneyEarned > 30000) return message.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số nhỏ hơn \`30.000\`")]});
    if (isNaN(args[0])) return message.reply({ embeds: [checkMoney.setDescription("Vui lòng chỉ định một số hợp lệ!")] });
    await client.cs.removeMoney({ user: message.author, amount: moneyEarned });
    let clicks = 3;
    let options = {
        ic: '💵',
        jc: '🧧'
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
        description: `Tiền cược: **${moneyEarned.toLocaleString()}₫**\nBạn còn: **${clicks}** lượt cào số.`,
        title: { name: `${message.author.username} kiếp đỏ đen` },
        timestamp: Date.now(),
        colors: "Random"
    });
    let msg = await message.reply({ embeds: [embed], components: [row1, row2, row3, row4, row5] })
    let collector = msg.createMessageComponentCollector({
        ComponentType: ComponentType.Button,
        filter: (i) => i.user.id === message.author.id,
        time: 120000,
        max: 3
    });
    collector.on('collect', async (i) => {
        if (!i.isButton()) return;
        i.deferUpdate();
        let used = positions.find((x) => x.a.custom_id === i.customId);
        if (used.r.style === clss.toButtonStyle("Danger")) {
            let moneylost = moneyEarned * 0.25;
            moneyEarned -= Math.trunc(moneylost);
            clicks -= 1;
        } else if (used.r.style === clss.toButtonStyle("Success")) {
            let moneywon = moneyEarned * 0.09;
            moneyEarned += Math.trunc(moneywon);
            clicks -= 1;
        } else if (used.r.style === clss.toButtonStyle("Primary")) {
            let moneyjackpot = moneyEarned * 8.99;
            moneyEarned += moneyjackpot;
            clicks -= 1;
        };
        used.a = used.r;
        embed = new EmbedBuilders({
            description: `Tiền thắng: **${moneyEarned.toLocaleString()}₫ ** \nBạn có: **${clicks}** lần cào nữa.`,
            title: { name: `${message.author.username} kiếp đỏ đen` },
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
            g.a = g.r
            row1 = new ActionRowBuilder({ components: [positions[0].a, positions[1].a, positions[2].a] });
            row2 = new ActionRowBuilder({ components: [positions[3].a, positions[4].a, positions[5].a] });
            row3 = new ActionRowBuilder({ components: [positions[6].a, positions[7].a, positions[8].a] });
            row4 = new ActionRowBuilder({ components: [positions[9].a, positions[10].a, positions[11].a] });
            row5 = new ActionRowBuilder({ components: [positions[12].a, positions[13].a, positions[14].a] });
        });
        const money = (`${Math.trunc(moneyEarned)}`);
        await client.cs.addMoney({ user: message.author.id, amount: money });
        embed = new EmbedBuilders({
            description: `Bạn đã cào được: **${moneyEarned.toLocaleString()}₫ **\nBạn đã nhận được: **${money.toString()}**`,
            title: { name: `${message.author.username} kiếp đỏ đen` },
            timestamp: Date.now(),
            colors: "Random"
        });
        msg.edit({ embeds: [embed], components: [row1, row2, row3, row4, row5] });
    });
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;