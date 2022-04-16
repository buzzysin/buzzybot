import logger from "@buzzybot/cli/logger";
import { Command } from "commander";

export type BzGenerateCommandOpts = {};

export const actionBzGenerateCommand = async (name: string, opts: BzGenerateCommandOpts, command: Command) => {
  const log = logger(command);

  log.warn("Thanks for being so keen. Unfortunately, we haven't implemented this yet,");
  log.warn("but we should let you know on release whether this function is available for use.")
};
