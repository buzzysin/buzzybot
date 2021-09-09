import logger from "@buzzybot/cli/logger";
import { createArgument, createCommand } from "commander";
import { optForce } from "../options/opt-force";

export const bzGenerateCommand = createCommand("slash")
  .description("create a class for handling slash commands")

  .addArgument(createArgument("<name>", "the base name of the command"))

  .addOption(optForce)

  .action(async (name, opts, command) => {
    const log = logger(command);
    log.success(name, opts);
  });
