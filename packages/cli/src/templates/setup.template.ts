import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type SetupTemplateOpts = Pick<BzInitOpts, "ext"> & {};

export default function setupTemplate(opts: SetupTemplateOpts) {
  const { ext } = opts;
  return dedent`
  ${importTemplate({ ext, value: "{ Injex }", module: "@injex/node" })};
  ${importTemplate({ ext, value: "{ LogLevel }", module: "@injex/stdlib" })};
  ${importTemplate({
    ext,
    value: "{ DiscordInjexPlugin, hide }",
    module: "@buzzybot/injex-discord-plugin",
  })};
  ${importTemplate({
    ext,
    value: "{ Client, GatewayIntentBits, Partials }",
    module: "discord.js",
  })};
  ${importTemplate({ ext, value: "{ join }", module: "path" })};
  ${importTemplate({
    ext,
    value: "{ apiToken, botId, guildId }",
    module: "@src/setup/setup-env",
  })};

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
          ]
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
      join(process.cwd(), "dist")
    ],
    logLevel: LogLevel.Debug // match example which runs in dev mode by default
  });

  export const setup = globalThis.setup;
  `.trimStart();
}
