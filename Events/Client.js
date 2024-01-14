import Discord, { Client as DiscordClient, GatewayIntentBits, Partials, Collection, Routes, REST, ActivityType, Events } from "discord.js";
import { SoundCloudPlugin as DistibeSoundCloud } from "@distube/soundcloud";
import { SpotifyPlugin as DistubeSpotify } from "@distube/spotify";
import { YtDlpPlugin as DistubeYtDlp } from "@distube/yt-dlp";
import { DisTube as DistubeHandler } from "distube";
import CurrencySystem from "currency-system";
import { AsciiTable3 } from 'ascii-table3';
import { EventEmitter } from "node:events";
import { readdir } from "node:fs/promises";
import * as fs from 'node:fs';
import colors from "chalk";
// yêu cầu các files
import { classComponent } from "./functions.js";
/*========================================================
# Economy. npm currency-system
========================================================*/
const EconomyHandler = class extends CurrencySystem {
  constructor(client, options) {
    super();
    this.client = client;
    this.setDefaultWalletAmount(options.setDefaultWalletAmount || 1000);
    this.setDefaultBankAmount(options.setDefaultBankAmount || 1000);
    this.setMaxWalletAmount(options.setMaxWalletAmount || 0);
    this.setMaxBankAmount(options.setMaxBankAmount || 0);
    this.setMongoURL(options.setMongoURL, false);
    // hiển thị nếu có phiêm bản mới
    this.searchForNewUpdate(options.searchForNewUpdate || true);
    // thiết lập tiền tệ của các nước.
    this.formats = options.setFormat;
    this.__init();
  };
  // Phân loại tiền theo các nước
  formatter(money) {
    const c = new Intl.NumberFormat(this.formats[0], {
      style: 'currency',
      currency: this.formats[1],
    });
    return c.format(money);
  };
  // chạy emitting
  __init() {
    CurrencySystem.cs.on("debug", (debug, error) => {
      console.log(debug);
      if(error) console.error(error);
    });
    CurrencySystem.cs.on("userFetch", (user, functionName) => {
      console.log(colors.magenta(`(${functionName}):`) + " " + colors.cyan(`Đã tìm nạp người dùng: ${this.client.users.cache.get(user.userID).tag}`));
    });
    CurrencySystem.cs.on("userUpdate", (oldData, newData) => {
      console.log(colors.green("Người dùng đã cập nhật: ") + colors.yellow(`${this.client.users.cache.get(newData.userID).tag}`));
    });
  };
};
/*========================================================
# DiscordClient Events
========================================================*/
const { globalFilePath } = new classComponent();
// 
export default class Client extends DiscordClient {
  constructor(config) {
    super({
      messageCacheLifetime: 60,
      messageCacheMaxSize: 10,
      fetchAllMembers: false,
      restTimeOffset: 0,
      restWsBridgetimeout: 100,
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      partials: [Partials.User, Partials.Message, Partials.Reaction], //Object.keys(Partials), // get tất cả sự kiện mà partials
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates], //Object.keys(GatewayIntentBits), // get tất cả sự kiện mà GatewayIntentBits có
    });
    /*================================================================================================================*/
    this.config = config.setConfig; // lấy data từ config.json
    this.mongo = process.env.mongourl || this.config.mongourl; // lấy đường link mongourl của bạn
    this.token = process.env.token || this.config.token; // lấy thông báo discord bot 
    /*================================================================================================================*/
    this._init();
    this.starts();
  };
  /*================================================================================================================*/
  _init() {
    this.slashCommands = new Collection();
    this.cooldowns = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.maps = new Map();
    // Hệ thống tiền tệ
    this.cs = new EconomyHandler(this, {
      setFormat: ["vi-VN", "VND"], // xác định loại tiền của các nước
      // Đặt số tiền ngân hàng mặc định khi người dùng mới được tạo!
      setDefaultWalletAmount: 10000, // trong ví tiền
      setDefaultBankAmount: 10000, // trong ngân hàng
      setMaxWalletAmount: 0, // Đặt số lượng tiền trong ví tiền tối đa mặc định mà người dùng có thể có! ở đây 0 có nghĩa là vô hạn.
      setMaxBankAmount: 0, // Giới hạn dung lượng ngân hàng của nó ở đây 0 có nghĩa là vô hạn.
      setMongoURL: this.mongo, // mongourl 
      searchForNewUpdate: true, // kiểm tra thông báo phiên bản mới
    });
    // Distube - bảng điều khiển nhạc nhẽo các thứ
    this.distube = new DistubeHandler(this, {
      searchSongs: 0, // Giới hạn kết quả tìm kiếm phát ra trong sự kiện DisTube#event:searchResult khi phương thức DisTube#play được thực thi. Nếu searchSongs <= 1, hãy phát kết quả đầu tiên
      searchCooldown: 30, // Thời gian hồi lệnh tìm kiếm tích hợp trong vài giây (Khi bài hát tìm kiếm lớn hơn 0)
      emptyCooldown: 25, // Tích hợp nghỉ phép khi thời gian hồi lệnh trống trong vài giây (Khi leftOnEmpty là đúng)
      joinNewVoiceChannel: false, // Có tham gia kênh thoại mới hay không khi sử dụng phương thức DisTube#play
      savePreviousSongs: true, // Có hoặc không lưu các bài hát trước đó của hàng đợi và bật phương thức DisTube#previous
      leaveOnFinish: false, // Có rời kênh thoại khi hàng đợi kết thúc hay không.
      leaveOnEmpty: true, // Có rời khỏi kênh thoại hay không nếu kênh thoại trống sau DisTubeOptions.emptyCooldown giây.
      leaveOnStop: true, // Có rời khỏi kênh thoại sau khi sử dụng chức năng DisTube#stop hay không.
      directLink: true, // Có hay không phát một bài hát với liên kết trực tiếp
      nsfw: true, // Có hay không phát nội dung giới hạn độ tuổi và tắt tính năng tìm kiếm an toàn trong kênh không thuộc NSFW.
      plugins: [
        new DistubeSpotify({
          parallel: true, // Mặc định là true. Có hoặc không tìm kiếm danh sách phát song song.
          emitEventsAfterFetching: true, // Mặc định là false. Phát addList và playSong sự kiện trước hoặc sau khi tìm nạp tất cả các bài hát.
          api: {
            clientId: this.config.clientId, // Client ID của ứng dụng Spotify của bạn (Tùy chọn - Được sử dụng khi plugin không thể tự động lấy thông tin đăng nhập)
            clientSecret: this.config.clientSecret, // Client Secret của ứng dụng Spotify của bạn (Tùy chọn - Được sử dụng khi plugin không thể tự động lấy thông tin đăng nhập)
            topTracksCountry: "US", // Mã quốc gia của các bản nhạc của nghệ sĩ hàng đầu (mã quốc gia ISO 3166-1 alpha-2). Mặc định là US.
          }
        }),
        new DistubeYtDlp({
          update: true // Mặc định là true. Cập nhật tệp nhị phân yt-dlp khi plugin được khởi chạy.
        }),
        new DistibeSoundCloud(/*{
          clientId : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Id khách hàng của tài khoản của bạn.
          oauthToken : "0-000000-000000000-xxxxxxxxxxxxxx", // Mã thông báo oauth của tài khoản của bạn. Được sử dụng để tìm nạp thêm dữ liệu bằng tài khoản SoundCloud Go+.
        }*/),
      ], // DisTube plugins.
      youtubeCookie: this.config.youtubeCookie, // cookie YouTube. Đọc cách lấy nó trong Ví dụ của YTDL
      ytdlOptions: { // tùy chọn nhận thông tin ytdl-core
        highWaterMark: 1024 * 1024 * 64,
        quality: "highestaudio",
        format: "audioonly",
        liveBuffer: 60000,
        dlChunkSize: 1024 * 1024 * 4,
        youtubeCookie: this.config.youtubeCookie,
      },
      emitAddListWhenCreatingQueue: false, // Có hay không phát sự kiện addList khi tạo Queue mới
      emitAddSongWhenCreatingQueue: false, // Có hoặc không phát sự kiện addSong khi tạo Hàng đợi mới
      emitNewSongOnly: true, // Có hay không phát ra DisTube#event:playSong khi lặp một bài hát hoặc bài hát tiếp theo giống như bài hát trước đó
    });
    // thiết lập defaultMaxListeners = 100;
    const emitter = new EventEmitter()
    emitter.setMaxListeners(100);
  };   
  /*================================================================================================================*/
  async commandHandler(commandsPath) {
    let table = new AsciiTable3('Commands').setHeading("Tên Lệnh", "Trạng thái").setStyle('unicode-round');
    const commandsDir = await readdir(commandsPath);
    await Promise.all(commandsDir.map(async(dir) => {
      const commandPath = await readdir(`${commandsPath}/${dir}`);
      const commands = commandPath.filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        const pull = await import(globalFilePath(`${commandsPath}/${dir}/${file}`)).then((x) => x.default);
        if (pull.name) {
          this.commands.set(pull.name, pull);
          table.addRowMatrix([
            [pull.name, "✔️ sẵn sàng"]
          ]);
        } else {
          table.addRowMatrix([
            [pull.name, "❌ Lỗi"]
          ]);
          continue;
        };
        if (pull.aliases && Array.isArray(pull.aliases)) {
          pull.aliases.forEach((alias) => this.aliases.set(alias, pull.name));
        };
      };
    }));
    console.log(colors.cyan(table.toString()));
  };
  /*================================================================================================================*/
  async slashHandlers(slashCommandsPath) {
    try {
      let table = new AsciiTable3('slashCommands').setHeading("Tên Lệnh", "Trạng thái").setStyle('unicode-round');
      let allCommands = [];
      const commandsDir = await readdir(slashCommandsPath);
      await Promise.all(commandsDir.map(async(dir) => {
        const commands = await readdir(`${slashCommandsPath}/${dir}`);
        let filterCommands = commands.filter((f) => f.endsWith(".js"));
        for (const slashCmds of filterCommands) {
          const command = await import(globalFilePath(`${slashCommandsPath}/${dir}/${slashCmds}`)).then((e) => e.default);
          this.slashCommands.set(command.name, command);
          if(!command.name || !command.description) {
            table.addRowMatrix([
              [command.name, "❌ Lỗi"]
            ]);
          } else {
            table.addRowMatrix([
              [command.name, "✔️ sẵn sàng"]
            ]);
          };
          allCommands.push({
            name: command.name.toLowerCase(),
            description: command.description,
            type: command.type,
            options: command.options ? command.options : null,
          });
        };
      }));
      this.on("ready", async() => {
        const rest = new REST({ version: "10" }).setToken(this.token);
        return await rest.put(Routes.applicationCommands(this.user.id), {
          body: allCommands
        });
      });
      console.log(colors.green(table.toString()));
    } catch (error) {
      console.log(error);
    };
  };
  /*================================================================================================================*/
  async evnetHandler(eventPath) {
    const events = async(eventsDir) => {
      let table = new AsciiTable3('Events - Create').setHeading("Tên events", "Trạng thái").setStyle('unicode-round');
      const eventFiles = fs.readdirSync(`${eventPath}/${eventsDir}`).filter((file) => file.endsWith(".js"));
      for (const file of eventFiles) {
        const evnt = await import(globalFilePath(`${eventPath}/${eventsDir}/${file}`)).then((e) => e.default);
        if(evnt.eventOnce) {
          this.once(evnt.eventName, (...args) => evnt.executeEvents(this, ...args));
        } else {
          this.on(evnt.eventName, (...args) => evnt.executeEvents(this, ...args));
        };
        if(evnt.eventName) {
          table.addRowMatrix([
            [evnt.eventCustomName, "✔️ sẵn sàng"]
          ]);
        } else {
          table.addRowMatrix([
            [evnt.eventCustomName, '❌']
          ]);
        };
      };
      console.log(colors.magenta(table.toString()));
    };
    return await ["Guilds"].forEach((e) => events(e));
  };
  /*================================================================================================================*/
  starts() {
    return this.login(this.token).then(() => {
      this.commandHandler(process.cwd() + "/Commands/PrefixCommands");
      this.slashHandlers(process.cwd() + "/Commands/SlashCommands");
      this.evnetHandler(process.cwd() + "/Events/");
    }).catch((e) => console.warn(colors.bgRed(e)));
  };
};