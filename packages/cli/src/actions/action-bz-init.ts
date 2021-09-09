import { confirmQuestion } from "@buzzybot/cli/inquiry/standard";
import logger, { infoString, Logger } from "@buzzybot/cli/logger";
import { BzProjectConfig } from "@buzzybot/cli/other/types";
import { magentaBright } from "chalk";
import { spawn } from "child_process";
import { Command } from "commander";
import { existsSync, mkdirp, writeJson } from "fs-extra";
import { readdir } from "fs/promises";
import { prompt } from "inquirer";
import { resolve } from "path";
import { install } from "pkg-install";

export type BzInitOpts = {
  force: boolean;
  commands: string;
  middleware: string;
  npmClient?: "yarn" | "npm";
  clientArgs: string[];
};

const initWarning = async (
  log: Logger,
  failTest: boolean,
  force: boolean,
  confirm: string,
  warning: string,
  error: string
) => {
  if (failTest) {
    if (force) {
      // ! Do not ask permission
      log.warn(`Warning - using the \`--force\`, ${warning}`);
    } else {
      const permission = await prompt(confirmQuestion(confirm));

      if (!permission.confirm_) {
        // ! Exit
        log.error(error);
        log.error("");
        log.error("To ignore this message, use the `--force`!");
        return false;
      }
    }
  }

  return true;
};

const actionBzInit = async (dir: string, opts: BzInitOpts, command: Command) => {
  const log = logger(command);
  const { force, commands, middleware, npmClient, clientArgs } = opts;

  log.info("Initialising new Discord.JS project");

  const dirFullPath = resolve(dir);
  const dirExists = existsSync(dirFullPath);
  const dirHasFiles = await readdir(dirFullPath)
    .then(files => files.length > 0)
    .catch(() => false);

  const dirCheck = await initWarning(
    log,
    dirExists && dirHasFiles,
    force,
    "There is a non-empty folder at this path. Would you like to continue?",
    "possibly writing over an existing project",
    "Directory exists at the provided location."
  );

  if (!dirCheck) return;

  log.success("Directory check passed.");

  const dirPath = (...segments: string[]) => resolve(dirFullPath, ...segments);
  const projectExists = existsSync(dirPath("buzzybot.json"));

  const projectJson: Partial<BzProjectConfig> = (projectExists && require(dirPath("buzzybot.json"))) || {};

  const projectCheck = await initWarning(
    log,
    dirExists && projectExists,
    force,
    "There is an existing project in this folder. Would you like to continue?",
    "forced write into buzzybot.json",
    "Existing Discord.JS project in this folder."
  );

  if (!projectCheck) return;

  log.info("Initialising folder...");

  await mkdirp(dirPath());

  log.info("Checking for package.json...");

  const packageJsonExists = existsSync(dirPath("package.json"));

  const npmInitCheck = await initWarning(
    log,
    dirExists && !packageJsonExists,
    force,
    "There is no package.json in this directory. Would you like to run `npm init`?",
    "executing `npm init`",
    "Failed to initialise node project."
  );

  if (!npmInitCheck) return;

  if (!packageJsonExists) {
    await new Promise((resolve, reject) => {
      const child = spawn("npm", ["init"], { cwd: dirPath() });

      process.stdin.pipe(child.stdin);

      child.stdout.on("data", (data: Buffer) => {
        const lines = data.toString().split("\n");
        for (let i = 0, len = lines.length; i < len; i++) {
          const line = lines[i];
          process.stdout.write([infoString(command), magentaBright`npm init`, line].join(" ") + (i < len ? "\n" : ""));
        }
      });

      child.on("close", exitNo => {
        if (exitNo === 0) return resolve(exitNo);
        return reject(exitNo);
      });
    });
  }

  log.info("Updating dependencies...");

  const installOpts = {
    cwd: dirPath(),
    stdio: "pipe" as const,
    ...(npmClient ? { prefer: npmClient } : {}),
  };

  await install(
    {
      "@buzzybot/injex-discord-plugin": `latest`,
    },
    installOpts
  );

  await install(
    {
      "@buzzybot/cli": `latest`,
    },
    {
      ...installOpts,
      dev: true,
    }
  );

  log.info("Writing buzzybot.json...");

  projectJson.commands = commands;
  projectJson.middleware = middleware;
  projectJson.version = require("../../package.json").version;

  await writeJson(dirPath("buzzybot.json"), projectJson, { spaces: 2, flag: "w+" });

  log.info("Writing project folders...");

  await mkdirp(dirPath("src"));
  await mkdirp(dirPath("src/commands"));
  await mkdirp(dirPath("src/middleware"));

  log.info("Writing project files...");

  // TODO: Templates

  log.success("Done.");
};

export default actionBzInit;