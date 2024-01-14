import { TwoZeroFourEight, FastType, FindEmoji, Flood, GuessThePokemon, Hangman, MatchPairs, Minesweeper, Slots, Snake, Trivia, Wordle, WouldYouRather } from "discord-gamecord";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { slashCommandBuilder } from "../../../Events/functions.js";
// cấu trúc yêu cầu
const slashCommand = new slashCommandBuilder({
  name: "games-singleplayer", // Tên lệnh 
  description: "Chơi minigame một người chơi trong Discord.", // Mô tả lệnh
  userPerms: [], // quyền của thành viên có thể sử dụng lệnh
  owner: false, // true để chuyển thành lệnh của chủ bot, false để tắt
  cooldown: 5, // thời gian hồi lệnh
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "game",
      description: "Chọn một trò chơi để chơi",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "2048", value: "2048" },
        { name: "Fast-Type", value: "fasttype" },
        { name: "Find-Emoji", value: "findemoji" },
        { name: "Flood", value: "flood" },
        { name: "Guess-The-Pokemon", value: "guessthepokemon" },
        { name: "Hangman", value: "hangman" },
        { name: "Match-Pairs", value: "matchpairs" },
        { name: "Minesweeper", value: "minesweeper" },
        { name: "Slots", value: "slots" },
        { name: "Snake", value: "snake" },
        { name: "Trivia", value: "trivia" },
        { name: "Wordle", value: "wordle" },
        { name: "Would-You-Rather", value: "wouldyourather" },
      ]
    }
  ]
}).addSlashCommand(async(client, interaction) => {
  const game = interaction.options.getString("game");
  if(game === "2048") {
    const Game = new TwoZeroFourEight({
      message: interaction,
      slash_command: true,
      embed: {
        title: '2048',
        color: '#2f3136'
      },
      emojis: {
        up: '⬆️',
        down: '⬇️',
        left: '⬅️',
        right: '➡️',
      },
      timeoutTime: 60000,
      buttonStyle: 'Primary',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });
    Game.startGame();
  } else if(game === "fasttype") {
    const Game = new FastType({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Fast Type',
        color: '#2f3136',
        description: 'Bạn có {time} giây để nhập câu bên dưới.'
      },
      timeoutTime: 60000,
      sentence: 'Một số câu thực sự mát mẻ để gõ nhanh.',
      winMessage: 'Bạn đã thắng! Bạn đã hoàn thành cuộc đua loại sau {time} giây với wpm là {wpm}.',
      loseMessage: 'Bạn đã thua! Bạn đã không gõ đúng câu đúng lúc.',
    });
    Game.startGame();
  } else if(game === "findemoji") {
    const Game = new FindEmoji({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Find Emoji',
        color: '#2f3136',
        description: 'Ghi nhớ các biểu tượng cảm xúc từ bảng bên dưới.',
        findDescription: 'Tìm biểu tượng cảm xúc {emoji} trước khi hết giờ.'
      },
      timeoutTime: 60000,
      hideEmojiTime: 5000,
      buttonStyle: 'Primary',
      emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
      winMessage: 'Bạn đã thắng! Bạn đã chọn đúng biểu tượng cảm xúc. {emoji}',
      loseMessage: 'Bạn đã thua! Bạn đã chọn sai biểu tượng cảm xúc. {emoji}',
      timeoutMessage: 'Bạn đã thua! Bạn đã hết thời gian. biểu tượng cảm xúc là {emoji}',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });
    Game.startGame();
  } else if(game === "flood") {
    const Game = new Flood({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Flood',
        color: '#2f3136',
      },
      difficulty: 13,
      timeoutTime: 60000,
      buttonStyle: 'Primary',
      emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
      winMessage: 'Bạn đã thắng! Bạn đã quay **{turns}**.',
      loseMessage: 'Bạn đã thua! Bạn đã quay **{turns}**.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  } else if(game === "guessthepokemon") {
    const Game = new GuessThePokemon({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Pokemon này là ai',
        color: '#2f3136'
      },
      timeoutTime: 60000,
      winMessage: 'Bạn đã đoán đúng! Nó là một {pokemon}.',
      loseMessage: 'Chúc may mắn lần sau! Nó là một {pokemon}.',
      errMessage: 'Không thể lấy dữ liệu pokemon! Vui lòng thử lại.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });
    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  } else if(game === "hangman") {
    const theme = [
      "nature",
      "sport",
      "color",
      "camp",
      "fruit",
      "discord",
      "winter",
      "pokemon",
      "blackcat"
    ];
    const chosenTheme = Math.round((Math.random() * theme.length))
    const Game = new Hangman({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Hangman',
        color: '#2f3136'
      },
      hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
      timeoutTime: 60000,
      theme: `${theme[chosenTheme]}`,
      winMessage: 'Bạn đã thắng! từ đó là **{word}**.',
      loseMessage: 'Bạn đã thua! từ đó là **{word}**.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  } else if(game === "matchpairs") {
    const Game = new MatchPairs({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Match Pairs',
        color: '#2f3136',
        description: '**Nhấp vào các nút để khớp các biểu tượng cảm xúc với các cặp của chúng.**'
      },
      timeoutTime: 60000,
      emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
      winMessage: '**Bạn chiến thắng trò chơi! Bạn đã lật tổng số ô `{tilesTurned}`.**',
      loseMessage: '**Bạn đã thua trò chơi! Bạn đã lật tổng số ô `{tilesTurned}`.**',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  } else if(game === "minesweeper") {
    const Game = new Minesweeper({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Minesweeper',
        color: '#2f3136',
        description: 'Nhấp vào các nút để hiển thị các khối ngoại trừ mỏ.'
      },
      emojis: { flag: '🚩', mine: '💣' },
      mines: 5,
      timeoutTime: 60000,
      winMessage:  'Bạn chiến thắng trò chơi! Bạn đã tránh thành công tất cả các mỏ.',
      lossMessage: 'Bạn đã thua Trò chơi! Hãy cẩn thận với các mỏ vào lần tới.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  } else if(game === "slots") {
    const Game = new Slots({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Slot Machine',
        color: '#2f3136'
      },
      slots: ['🍇', '🍊', '🍋', '🍌']
    });

    Game.startGame();
  } else if(game === "snake") {
    const Game = new Snake({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Snake Game',
        overTitle: 'Game Over',
        color: '#2f3136'
      },
      emojis: { board: '⬛', food: '🍎', up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️', },
      stopButton: 'Dừng lại',
      timeoutTime: 60000,
      snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
      foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  } else if(game === "trivia") {
    const Game = new Trivia({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Trivia',
        color: '#2f3136',
        description: 'Bạn có 60 giây để đoán câu trả lời.'
      },
      timeoutTime: 60000,
      buttonStyle: 'Primary',
      trueButtonStyle: 'Success',
      falseButtonStyle: 'Danger',
      mode: 'multiple',  // multiple || single
      difficulty: 'medium',  // easy || medium || hard
      winMessage: 'Bạn đã thắng! Đáp án đúng là {answer}.',
      loseMessage: 'Bạn đã thua! Đáp án đúng là {answer}.',
      errMessage: 'Không thể lấy dữ liệu câu hỏi! Vui lòng thử lại.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  } else if(game === "wordle") {
    const Game = new Wordle({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Wordle',
        color: '#2f3136',
      },
      customWord: null,
      timeoutTime: 60000,
      winMessage: 'Bạn đã thắng! từ đó là **{word}**.',
      loseMessage: 'Bạn đã thua! từ đó là **{word}**.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });
    
    Game.startGame();
  } else if(game === "wouldyourather") {
    const Game = new WouldYouRather({
      message: interaction,
      slash_command: true,
      embed: {
        title: 'Would You Rather',
        color: '#2f3136',
      },
      buttons: {
        option1: 'lựa chọn 1',
        option2: 'Lựa chọn 2',
      },
      timeoutTime: 60000,
      errMessage: 'Không thể lấy dữ liệu câu hỏi! Vui lòng thử lại.',
      playerOnlyMessage: 'Chỉ {player} mới có thể sử dụng các nút này.'
    });

    Game.startGame();
  };
});
// console.log(slashCommand.toJSON());
export default slashCommand;