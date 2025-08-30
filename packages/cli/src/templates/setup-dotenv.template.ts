import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type SetupDotenvTemplateOpts = Pick<BzInitOpts, "ext">;

export default function setupDotenvTemplate(opts: SetupDotenvTemplateOpts) {
  const { ext } = opts;
  return dedent`
  ${importTemplate({ ext, value: "{ config }", module: "dotenv" })};

  /**
   * First load the .env info into process.env
   */
  // preserve any existing global env load
  declare global {
    var env: ReturnType<typeof config> | undefined;
  }
  globalThis.env = globalThis.env || config();

  /**
   * Then we bind it so we can use it later
   *
   * For more info about these variables, see the .env file
   */
  export const botId    = process.env.DISCORD_BOT_ID${ext === "ts" ? "!" : ""};
  export const guildId  = process.env.DISCORD_GUILD_ID${
    ext === "ts" ? "!" : ""
  };
  export const apiToken = process.env.DISCORD_API_TOKEN${
    ext === "ts" ? "!" : ""
  };
  `.trimStart();
}
