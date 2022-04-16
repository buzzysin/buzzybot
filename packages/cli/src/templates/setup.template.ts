import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type SetupTemplateOpts = Pick<BzInitOpts, "ext"> & {};

export default function setupTemplate(opts: SetupTemplateOpts) {
  const { ext } = opts;
  return dedent`
  ${importTemplate({ ext, value: "{ Injex }", module: "@injex/node" })};
  ${importTemplate({ ext, value: "{ LogLevel }", module: "@injex/stdlib" })};
  ${importTemplate({ ext, value: "{ DiscordInjexPlugin }", module: "@buzzybot/injex-discord-plugin" })};
  ${importTemplate({ ext, value: "{ Intents }", module: "discord.js" })};
  ${importTemplate({ ext, value: "{ join }", module: "path" })};
  ${importTemplate({ ext, value: "{ apiToken, devId, devServer }", module: "@src/setup/setup-env" })};

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
  `.trimStart();
}
