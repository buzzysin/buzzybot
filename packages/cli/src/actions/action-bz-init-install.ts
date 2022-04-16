import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import logger from "@buzzybot/cli/logger";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import { packageJsonGenerator } from "@buzzybot/cli/templates/package.json.template";
import { Command } from "commander";
import { existsSync, writeJson } from "fs-extra";
import { install } from "pkg-install";

export type BzInitInstallOpts = Pick<BzInitOpts, "ext" | "force" | "npmClient" | "skipInstalls"> & {};

export const actionBzInitInstall = async (dir: string, opts: BzInitInstallOpts, command: Command) => {
  const log = logger(command);
  const { ext, force, npmClient, skipInstalls } = opts;
  const dirPath = fsPathFrom(dir);

  log.info("Checking for package.json...");

  const packageJsonExists = existsSync(dirPath("package.json"));

  // const npmInitCheck = await initWarning(
  //   log,
  //   force,
  //   !packageJsonExists,
  //   "There is no package.json in this directory. Would you like to run create one?",
  //   "writing a new package.json",
  //   "Failed to initialise node project."
  // );

  // if (!npmInitCheck) return;

  await writeJson(dirPath("package.json"), packageJsonGenerator({ ext, cwd: dirPath() }), { spaces: 2 });

  /**
   * After this point, there is a package.json in the project
   */

  if (skipInstalls) {
    log.info("Skipping installs...")
  } else {
    const installOpts = {
      cwd: dirPath(),
      stdio: ("ignore" as const) || ("inherit" as const),
      ...(npmClient ? { prefer: npmClient } : {}),
    };

    log.info("Managing dependencies...");

    await writeJson(dirPath("package.json"), packageJsonGenerator({ ext, cwd: dirPath() }), { spaces: 2 });

    log.info("Installing dependencies...");

    await install(
      {
        "@injex/core": "latest",
        "@injex/node": "latest",
        "@buzzybot/injex-discord-plugin": "latest",
        dotenv: "latest",
      },
      installOpts
    );

    log.info("Installing development dependencies...");

    await install(
      {
        "@buzzybot/cli": "latest",
        "@babel/core": "latest",
        "@babel/cli": "latest",
        "@babel/plugin-transform-runtime": "latest",
        "@babel/plugin-proposal-decorators": "latest",
        "@babel/plugin-proposal-class-properties": "latest",
        "@babel/plugin-proposal-private-property-in-object": "latest",
        "@babel/plugin-proposal-private-methods": "latest",
        nodemon: "latest",
        rimraf: "latest",
        "npm-run-all": "latest",
        ...(ext === "ts"
          ? { typescript: "latest", "@babel/preset-typescript": "latest", "babel-plugin-module-resolver": "latest" }
          : {}),
      },
      { ...installOpts, dev: true }
    );
  }

  log.success("Done.");
};
