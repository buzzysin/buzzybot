"use strict";

// src/setup/index.ts
var import_node = require("@injex/node");
var import_stdlib = require("@injex/stdlib");
var import_injex_discord_plugin = require("@buzzybot/injex-discord-plugin");
var import_discord = require("discord.js");
var import_path = require("path");

// src/setup/setup-env.ts
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var devId = process.env.DISCORD_DEV_ID;
var devServer = process.env.DISCORD_DEV_SERVER;
var apiToken = process.env.DISCORD_API_TOKEN;

// src/setup/index.ts
var setup = import_node.Injex.create({
  globPattern: "/**/*.{js,ts}",
  plugins: [
    new import_injex_discord_plugin.DiscordInjexPlugin({
      token: apiToken,
      client: {
        intents: [
          /**
           * These are the required intents in order for most functions to work.
           * Feel free to change as you please!
           */
          import_discord.Intents.FLAGS.GUILDS,
          import_discord.Intents.FLAGS.GUILD_MEMBERS,
          import_discord.Intents.FLAGS.GUILD_MESSAGES,
          import_discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
          import_discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
          import_discord.Intents.FLAGS.GUILD_PRESENCES,
          import_discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
        ]
      },
      clientId: devId,
      devServer
    })
    // You can also add other fun plugins developed with Injex, such as the EnvPlugin.
  ],
  rootDirs: [
    /**
     * By default, babel is configured to build your bot. If you end up changing this, 
     * you will also want to change this to the directories that hold your command and 
     * middleware classes.
     */
    (0, import_path.join)(process.cwd(), "dist")
  ],
  logLevel: import_stdlib.LogLevel.Error
  // let's keep the console clean for you.
});
setup.bootstrap();
