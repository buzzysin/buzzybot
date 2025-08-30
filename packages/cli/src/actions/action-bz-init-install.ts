import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import logger from "@buzzybot/cli/logger";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import { packageJsonGenerator } from "@buzzybot/cli/templates/package.json.template";
import { Command } from "commander";
import { existsSync, writeJson } from "fs-extra";
import { install, SupportedPackageManagers } from "pkg-install";
import installPnpm from "../other/install-pnpm";
import getClient from "../other/get-client";

export type BzInitInstallOpts = Pick<
  BzInitOpts,
  | "ext"
  | "force"
  | "npmClient"
  | "skipInstalls"
  | "cliVersion"
  | "pluginVersion"
> & {};

export const actionBzInitInstall = async (
  dir: string,
  opts: BzInitInstallOpts,
  command: Command
) => {
  const log = logger(command);
  const dirPath = fsPathFrom(dir);
  const {
    ext,
    force,
    npmClient = getClient({ cwd: dirPath() }),
    skipInstalls,

    cliVersion = "latest",
    pluginVersion = "latest",
  } = opts;

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

  await writeJson(
    dirPath("package.json"),
    packageJsonGenerator({ ext, cwd: dirPath() }),
    { spaces: 2 }
  );

  /**
   * After this point, there is a package.json in the project
   */

  if (skipInstalls) {
    log.info("Skipping installs...");
  } else {
    const installOpts = {
      cwd: dirPath(),
      stdio: /* ("ignore" as const) || */ "inherit" as const,
      ...{
        prefer: npmClient as SupportedPackageManagers,
      },
    };

    log.info("Managing dependencies...");

    await writeJson(
      dirPath("package.json"),
      packageJsonGenerator({ ext, cwd: dirPath() }),
      { spaces: 2 }
    );

    log.info(`Installing dependencies (${npmClient})...`);

    let installer = npmClient == "pnpm" ? installPnpm : install;

    await installer(
      {
        "@injex/core": "3.5.1",
        "@injex/node": "3.5.1",
        "@injex/stdlib": "3.5.1",
        "@buzzybot/injex-discord-plugin": pluginVersion,
        "discord.js": "latest",
        dotenv: "latest",
      },
      installOpts
    );

    log.info("Installing development dependencies...");

    await installer(
      {
        "@buzzybot/cli": cliVersion,
        nodemon: "latest",
        rimraf: "latest",
        ...(ext === "ts"
          ? {
              "@swc/core": "latest",
              typescript: "latest",
              tslib: "latest",
              tsup: "latest",
            }
          : {}),
      },
      { ...installOpts, dev: true }
    );
  }

  log.success("Done.");
};
