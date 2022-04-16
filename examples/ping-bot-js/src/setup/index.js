const { Injex } = require("@injex/node");
const { LogLevel } = require("@injex/stdlib");
const { DiscordInjexPlugin } = require("@buzzybot/injex-discord-plugin");
const { Intents } = require("discord.js");
const { join } = require("path");
const { apiToken, devId, devServer } = require("@src/setup/setup-env");

const setup = Injex.create({
  globPattern: "/**/*.{js,ts}",
  plugins: [
    new DiscordInjexPlugin({
      token: apiToken,
      client: {
        intents: [
          /**
           * These are the required intents in order for most functions to work.
           * Feel free to change as you please!
           */
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
          Intents.FLAGS.GUILD_MESSAGE_TYPING,
          Intents.FLAGS.GUILD_PRESENCES,
          Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        ]
      },
      clientId: devId,
      devServer: devServer
    }),
     // You can also add other fun plugins developed with Injex, such as the EnvPlugin.
  ],
  rootDirs: [
    /**
     * By default, babel is configured to build your bot. If you end up changing this, 
     * you will also want to change this to the directories that hold your command and 
     * middleware classes.
     */
    join(process.cwd(), "dist")
  ],
  logLevel: LogLevel.Error // let's keep the console clean for you.
});

setup.bootstrap();