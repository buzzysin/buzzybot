import { actionBzGenerateMiddleware } from "@buzzybot/cli/actions/action-bz-generate-middleware";
import { optForce } from "@buzzybot/cli/user-input/opt-force";
import { createArgument, createCommand } from "commander";

export const bzGenerateMiddleware = createCommand("middleware")
  .description("create a handler for protecting access to commands")

  .addArgument(createArgument("<name>", "the base name of the middleware."))

  .addOption(optForce)

  .action(actionBzGenerateMiddleware);
