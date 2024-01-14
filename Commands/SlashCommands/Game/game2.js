import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { RPSGame } from "../../../Events/Functions/Game.js";
import { Connect4 } from "discord-gamecord";
import TicTacToe from "discord-tictactoe";
import { slashCommandBuilder, EmbedBuilders } from "../../../Events/functions.js";
// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
  name: "games-multiplayer", // Tên lệnh 
  description: "Chơi minigame nhiều người chơi trong Discord.", // Mô tả lệnh
  userPerms: [], // quyền của thành viên có thể sử dụng lệnh
  owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
  cooldown: 3, // thời gian hồi lệnh
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "game",
      description: "Chọn một trò chơi để chơi.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Connect-4", value: "connect4" },
        { name: "TicTacToe", value: "tictactoe" },
        { name: "RPSGame", value: "RPSGame" }
      ]
    }, {
      name: "user",
      description: "Bạn muốn chơi cùng ai",
      type: ApplicationCommandOptionType.User,
      required: true,
    }
  ]
}).addSlashCommand((client, interaction) => {
  const game = interaction.options.getString("game");
  const user = interaction.options.getUser("user");
  if (game === "tictactoe") {
    const ttt = new TicTacToe({ language: 'vi' });
    ttt.handleInteraction(interaction);
  } else if (game === "RPSGame") {
    const rps = new RPSGame({
      message: interaction,
      slashCommand: true,
      opponent: user,
      embed: {
        title: 'Oẳn tù tì',
        description: 'Nhấn một nút bên dưới để thực hiện một sự lựa chọn!',
        color: "Red",
      },
      buttons: {
        rock: 'Rock',
        paper: 'Paper',
        scissors: 'Scissors',
      },
      emojis: {
        rock: '🌑',
        paper: '📃',
        scissors: '✂️',
      },
      othersMessage: 'Bạn không được phép sử dụng các nút cho tin nhắn này!',
      chooseMessage: 'bạn chọn {emoji}!',
      noChangeMessage: 'Bạn không thể thay đổi lựa chọn của mình!',
      askMessage: 'Này {opponent}, {challenger} đã thách đấu bạn trong trò chơi Oẳn tù tì!',
      cancelMessage: 'Có vẻ như họ từ chối chơi trò Oẳn tù tì. \:(',
      timeEndMessage: 'Vì đối thủ không trả lời, tôi đã bỏ trò chơi!',
      drawMessage: 'Đó là một trận hòa!',
      winMessage: '{winner} thắng trận đấu!',
      gameEndMessage: 'Trò chơi chưa hoàn thành :(',
    });
    rps.startGame();
  };
});
// console.log(slashCommand.toJSON());
export default slashCommand;