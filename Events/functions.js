import fetch from "node-fetch";
// function
export { slashCommandBuilder, commandBuilders, eventBuilders } from "./Functions/commands.js";
export { EmbedBuilders, addComponents } from "./Functions/discord.js";
export { switchLanguage } from "./Functions/I18nProvider.js";
export { embedCreator } from "./Functions/embedCreator.js";
export { classComponent } from "./Functions/components.js";
export { RPSGame, Slots } from "./Functions/Game.js";
/*========================================================
# baseURL
========================================================*/
export const baseURL = async (url, options) => {
  const response = options ? await fetch(url, options) : await fetch(url);
  const json = await response.json();
  return {
    success: response.status === 200 ? true : false,
    status: response.status,
    data: json,
  };
};