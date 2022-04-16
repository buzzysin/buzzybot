import { bzGenerateMiddleware } from "@buzzybot/cli/commands/bz-generate-middleware";
import { createCommand } from "commander";
import { bzGenerateCommand } from "./bz-generate-command";

export const bzGenerate = createCommand("generate")
  .description("generate class files for your Discord.JS project")

  .addCommand(bzGenerateCommand)
  .addCommand(bzGenerateMiddleware);
