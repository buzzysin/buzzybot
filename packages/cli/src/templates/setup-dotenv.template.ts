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
  config();

  /**
   * Then we bind it so we can use it later 
   * 
   * For more info about these variables, see the .env file
   */
  export const devId     = process.env.DISCORD_DEV_ID${ext === "ts" ? "!" : ""};
  export const devServer = process.env.DISCORD_DEV_SERVER${ext === "ts" ? "!" : ""};
  export const apiToken  = process.env.DISCORD_API_TOKEN${ext === "ts" ? "!" : ""};
  `.trimStart();
}
