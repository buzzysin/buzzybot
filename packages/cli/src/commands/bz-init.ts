import actionBzInit from "@buzzybot/cli/actions/action-bz-init";
import { createArgument, createCommand, createOption } from "commander";
import { optForce } from "../options/opt-force";

export const bzInit = createCommand("init")
  .description("generate a new Discord.JS project")

  .addArgument(createArgument("<dir>", "the name of the folder to write the files into"))

  .addOption(createOption("-n, --name <dir>", "the folder to create the bot project"))
  .addOption(
    createOption("-e, --ext [ext]", "the extension to generate the project with") /*  */
      .default("ts")
      .choices(["js", "ts"])
  )
  .addOption(createOption("-c, --commands [commands]", "the folder to store command classes").default("commands"))
  .addOption(
    createOption("-m, --middleware [middleware]", "the folder to store middleware classes").default("middleware")
  )
  .addOption(optForce)

  .action(actionBzInit);
