import { config } from "dotenv";

/**
 * First load the .env info into process.env
 */
declare global {
  var env: ReturnType<typeof config> | undefined;
}
globalThis.env = globalThis.env || config();

/**
 * Then we bind it so we can use it later
 *
 * For more info about these variables, see the .env file
 */
export const botId = process.env.DISCORD_BOT_ID!;
export const guildId = process.env.DISCORD_GUILD_ID!;
export const apiToken = process.env.DISCORD_API_TOKEN!;
