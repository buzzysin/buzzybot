import logger from "@buzzybot/cli/logger";
import { Command } from "commander";

export type BzGenerateMiddlewareOpts = {};

export const actionBzGenerateMiddleware = async (name: string, opts: BzGenerateMiddlewareOpts, command: Command) => {
  const log = logger(command);

  log.warn("Thanks for being so keen. Unfortunately, we haven't implemented this yet,");
  log.warn("but we should let you know on release whether this function is available for use.");
};
