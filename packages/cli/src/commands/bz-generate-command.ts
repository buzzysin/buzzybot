import { actionBzGenerateCommand } from "@buzzybot/cli/actions/action-bz-generate-command";
import { createArgument, createCommand } from "commander";
import { optForce } from "../user-input/opt-force";

export const bzGenerateCommand = createCommand("slash")
  .description("create a class for handling slash commands")

  .addArgument(createArgument("<name>", "the base name of the command"))

  .addOption(optForce)

  .action(actionBzGenerateCommand);
