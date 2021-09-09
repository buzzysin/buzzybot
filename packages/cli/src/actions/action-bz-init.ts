import { confirmQuestion } from "@buzzybot/cli/inquiry/standard";
import logger from "@buzzybot/cli/logger";
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
};

const actionBzInit = async (dir: string, opts: BzInitOpts, command: Command) => {
  const log = logger(command);
  const { force, commands, middleware } = opts;

  log.info("Initialising new Discord.JS project");

  const dirFullPath = resolve(dir);
  const dirExists = existsSync(dirFullPath);
  const dirHasFiles = await readdir(dirFullPath)
    .then(files => files.length > 0)
    .catch(() => false);

  if (dirExists && dirHasFiles) {
    if (force) {
      // ! Do not ask for permission to write new folder
      log.warn("Warning - --force passed, possibly writing over existing project.");
    } else {
      let permission = await prompt(
        confirmQuestion("There is a non-empty folder at this path. Would you like to continue?")
      );

      if (!permission.confirm_) {
        // ! Exit
        log.error("Directory exists at provided location. Aborting operation.");
        log.error("");
        log.error("To ignore this (if you're sure!), use the --force flag.");
        return;
      }
    }
  }

  log.success("Directory check passed.");

  const dirPath = (...segments: string[]) => resolve(dirFullPath, ...segments);
  const projectExists = existsSync(dirPath("buzzybot.json"));

  let existingJson = (projectExists && require(dirPath("buzzybot.json"))) || {};

  if (projectExists) {
    if (force) {
      // ! Do not ask for permission to overwrite new project
      log.warn("Warning - --force passed, writing over existing project.");
    } else {
      let permission = await prompt(
        confirmQuestion("There is an existing project in this directory. Would you like to continue?")
      );

      if (!permission.confirm_) {
        // ! Exit
        log.error("Project file exists at provided location. Aborting operation.");
        log.error("");
        log.error("Either delete buzzybot.json or (if you're sure!) use the --force flag.");
        return;
      }
    }
  }

  log.info("Initialising folder...");

  await mkdirp(dirPath());

  log.info("Checking for package.json...");

  const packageJsonExists = existsSync(dirPath("package.json"));

  if (dirExists && !packageJsonExists) {
    if (force) {
      // ! Do not ask permission to initialise new node project
      log.warn("Warning - --force passed, executing npm init");
    } else {
      let permission = await prompt(
        confirmQuestion("There is no package.json in this directory. Would you like to run `npm init` and create it?")
      );

      if (!permission.confirm_) {
        // ! Exit
        log.error("Failed to initialise node project.");
        log.error("");
        log.error("Run `npm init` in an otherwise empty directory, or (if you're sure!) use the --force flag.");
        return;
      }
    }

    await new Promise((resolve, reject) => {
      const child = spawn("npm", ["init"], { cwd: dirPath() });
      process.stdout.pipe(child.stdin);

      child.stdout.on("data", (data: Buffer) => {
        const lines = data.toString().split("\n");
        for (const line of lines) log.info(magentaBright`npm init`, line);
      });

      child.on("close", exitNo => {
        if (exitNo === 0) return resolve(exitNo);
        return reject(exitNo);
      });
    });
  }

  log.info("Updating dependencies...");

  await install(
    {
      "@buzzybot/cli": `^${require("../../package.json").version}`,
      "@buzzybot/injex-discord-plugin": `latest`,
    },
    {
      cwd: dirPath(),
      prefer: "yarn",
      stdio: "pipe",
    }
  );

  log.info("Writing buzzybot.json...");

  await writeJson(
    dirPath("buzzybot.json"),
    {
      ...existingJson,
      commands: commands,
      middleware: middleware,
    },
    { spaces: 2, flag: "w+" }
  );

  log.info("Writing project folders...");

  await mkdirp(dirPath("src"));
  await mkdirp(dirPath("src/commands"));
  await mkdirp(dirPath("src/middleware"));

  log.info("Writing project files...");

  // TODO: Templates

  log.success("Done.");
};

export default actionBzInit;
