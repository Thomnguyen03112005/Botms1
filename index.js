import Client from "./Events/Client.js";
import path from "node:path";
import fs from "node:fs";

const client = new Client({
  setConfig: JSON.parse(fs.readFileSync(path.join("config.json"), 'utf8')),
});

// chạy các events bên ngoài
fs.readdirSync(path.join(".", "Handlers")).forEach((BlackCat) => {
  import(`./Handlers/${BlackCat}`).then((e) => e.default(client));
});