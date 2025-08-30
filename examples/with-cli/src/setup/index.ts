import { DiscordInjexPlugin, hide } from "@buzzybot/injex-discord-plugin";
import { Injex } from "@injex/node";
import { LogLevel } from "@injex/stdlib";
import { apiToken, botId, guildId } from "@src/setup/setup-env";
import { GatewayIntentBits } from "discord.js";
import { join } from "path";

declare global {
  var setup: Injex | undefined;
}
globalThis.setup =
  globalThis.setup ||
  Injex.create({
    globPattern: "/**/*.js",
    plugins: [
      new DiscordInjexPlugin({
        token: hide(apiToken),
        client: {
          intents: [
            /**
             * These are the required intents in order for most functions to work.
             * Feel free to change as you please!
             */
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildExpressions,
          ],
        },
        botId: botId,
        guildId: guildId,
      }),
      // You can also add other fun plugins developed with Injex, such as the EnvPlugin.
    ],
    rootDirs: [
      /**
       * By default, babel is configured to build your bot. If you end up changing this,
       * you will also want to change this to the directories that hold your command and
       * middleware classes.
       */
      join(process.cwd(), "dist"),
    ],
    logLevel: LogLevel.Debug, // let's keep the console clean for you.
  });

export const setup = globalThis.setup;
