const { config } = require("dotenv");

/**
 * First load the .env info into process.env
 */
config();

/**
 * Then we bind it so we can use it later 
 * 
 * For more info about these variables, see the .env file
 */
export const devId     = process.env.DISCORD_DEV_ID;
export const devServer = process.env.DISCORD_DEV_SERVER;
export const apiToken  = process.env.DISCORD_API_TOKEN;