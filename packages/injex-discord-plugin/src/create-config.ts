import { Client } from "discord.js";
import { IDiscordPluginConfig, IDiscordPluginCreateConfig } from "./interfaces/internal";

export const createConfig = (config: IDiscordPluginCreateConfig): IDiscordPluginConfig => {
  if (!("client" in config) || typeof config.client === "undefined") {
    return { ...config, client: new Client({ intents: [] }) };
  } else {
    if (config.client instanceof Client) {
      return { ...config, client: config.client };
    } else {
      return { ...config, client: new Client(config.client) };
    }
  }
};
