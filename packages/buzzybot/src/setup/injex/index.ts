import { DiscordInjexPlugin } from "@buzzybot/injex-discord-plugin";
import { Injex } from "@injex/node";
import { LogLevel } from "@injex/stdlib";
import { Intents } from "discord.js";
import { join } from "path";

export default async function setupInjex({
  token,
  clientId,
  guildId,
}: {
  token: string;
  clientId: string;
  guildId?: string;
}) {
  const injex = Injex.create({
    globPattern: "/**/*.js",
    plugins: [
      new DiscordInjexPlugin({
        token,
        client: {
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
          ],
        },
        clientId,
        devServer: guildId,
      }),
    ],
    rootDirs: [join(process.cwd(), "dist")],
    logLevel: LogLevel.Info,
  });

  return await injex.bootstrap();
}
