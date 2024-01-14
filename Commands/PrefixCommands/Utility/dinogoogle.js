import { commandBuilders } from "../../../Events/functions.js";
import { fileURLToPath } from 'node:url';
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new commandBuilders({
    name: path.parse(__filename).name, // Tên Lệnh chính
    usage: path.parse(__filename).name, // Cách sử dụng khi dùng lệnh help.
    category: path.parse(__dirname).name, // thể loại lệnh
    aliases: [], // lệnh phụ
    description: "Game vui khủng long vượt chướng ngoại vật", // mô tả dành cho lệnh
    cooldown: 5, // thời gian hồi lệnh
    owner: false, // bật tắt chế độ dev
    permissions: [] // quyền hạn khi sử dụng lệnh
}).addCommand(async (client, message, args, prefix) => {
    let msg = await message.reply({ content: `---------------🦖` });
    let time = 1 * 1000;
    setTimeout(function () {
        msg.edit(`-----------🦖----`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`----------🦖------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`--------🦖--------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`------🦖-----------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-------🦖-----------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`---🌵-----🦖---------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`---🌵-🦖-------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`🦖\n ---🌵--------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`------🦖---🌵--------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`----🦖-----🌵----------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-🌵🌵-----🦖-------🌵--------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`----🌵🌵-🦖----------🌵------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`🦖\n ---🌵🌵-------------🌵---`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-----🦖---🌵🌵-------------🌵--`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-------🦖-----🌵🌵-------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-🌵🌵------🦖--------🌵🌵-----------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`-🌵🌵---🦖-------------🌵🌵---------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`🦖\n🌵🌵----------------🌵🌵---------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`---------🦖--🌵🌵----------------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`🎁--------🦖--------🌵🌵---------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`---🎁---🦖----------🌵🌵---------`);
    }, time);
    time += 1.5 * 1000;

    setTimeout(function () {
        msg.edit(`**Ⓜⓘⓢⓢⓘⓞⓝ Ⓒⓞⓜⓟⓛⓔⓣⓔⓓ !**\n ---🎁🦖----------🌵🌵-------------`);
    }, time);
});
// console.log(commands.toJSON()); // hiển thị thông tin lệnh ở dạng JSON
export default commands;