import { actionBzInitFiles } from "@buzzybot/cli/actions/action-bz-init-files";
import { actionBzInitInstall } from "@buzzybot/cli/actions/action-bz-init-install";
import { forceWarning } from "@buzzybot/cli/inquiry/warning";
import logger from "@buzzybot/cli/logger";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import merge from "@buzzybot/cli/other/merge";
import { BzProjectConfig } from "@buzzybot/cli/other/types";
import { Command } from "commander";
import { existsSync, mkdirp, writeJson } from "fs-extra";
import { readdir } from "fs/promises";
import { resolve } from "path";

export type BzInitOpts = {
  ext: "ts" | "js";

  commands: string;
  middleware: string;

  npmClient?: "yarn" | "npm";

  skipInstalls: boolean;
  skipExtras: boolean;

  force: boolean;
};

const actionBzInit = async (dir: string, opts: BzInitOpts, command: Command) => {
  const log = logger(command);
  const { force, commands, middleware, npmClient, ext, skipExtras, skipInstalls } = opts;

  log.info("Initialising new Discord.JS project");

  const dirFullPath = resolve(dir);
  const dirExists = existsSync(dirFullPath);
  const dirHasFiles = await readdir(dirFullPath)
    .then(files => files.length > 0)
    .catch(() => false);

  const dirCheck = await forceWarning(
    log,
    force,
    dirExists && dirHasFiles,
    "There is a non-empty folder at this path. Would you like to continue?",
    "possibly writing over an existing project",
    "Directory exists at the provided location."
  );

  if (!dirCheck) return;

  log.success("Directory check passed.");

  const dirPath = fsPathFrom(dirFullPath);
  const projectExists = existsSync(dirPath("buzzybot.json"));

  log.info("Initialising folder...");

  await mkdirp(dirPath());

  /**
   * After this point, the project directory exists
   */

  const projectJson: Partial<BzProjectConfig> = merge(
    { commands, middleware, version: require("../../package.json").version },
    (projectExists && require(dirPath("buzzybot.json"))) || {}
  );

  const projectCheck = await forceWarning(
    log,
    force,
    projectExists,
    "There is an existing project in this folder. Would you like to continue?",
    "forced write into buzzybot.json",
    "Existing Discord.JS project in this folder."
  );

  if (!projectCheck) return;

  await actionBzInitInstall(dir, { ext, force, npmClient, skipInstalls }, command);

  log.info("Writing buzzybot.json...");
  await writeJson(dirPath("buzzybot.json"), projectJson, { spaces: 2, flag: "w+" });

  actionBzInitFiles(dir, { ext, commands, middleware, skipExtras, force }, command);

  log.success("Done.");
};

export default actionBzInit;
