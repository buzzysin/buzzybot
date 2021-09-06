import { config } from "dotenv";

config();

export const clientId = process.env.DISCORD_DEV_ID;
export const apiToken = process.env.DISCORD_API_TOKEN;
export const guildId = process.env.DISCORD_DEV_SERVER;
