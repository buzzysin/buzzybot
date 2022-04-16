import actionBzInit from "@buzzybot/cli/actions/action-bz-init";
import { bzInitFiles } from "@buzzybot/cli/commands/bz-init-files";
import { bzInitInstall } from "@buzzybot/cli/commands/bz-init-install";
import getConfig from "@buzzybot/cli/other/get-config";
import { argDir } from "@buzzybot/cli/user-input/arg-dir";
import { createCommand, createOption } from "commander";
import { optForce } from "../user-input/opt-force";

export const bzInit = createCommand("init")
  .description("generate a new Discord.JS project")

  .addArgument(argDir)

  .addOption(createOption("-n, --name <dir>", "the folder to create the bot project"))
  .addOption(
    createOption("-e, --ext [ext]", "the extension to generate the project with").default("ts").choices(["js", "ts"])
  )
  .addOption(createOption("-c, --commands [commands]", "the folder to store command classes").default("commands"))
  .addOption(
    createOption("-m, --middleware [middleware]", "the folder to store middleware classes").default("middleware")
  )
  .addOption(createOption("-C, --client [npmClient]", "the client to use when installing dependencies"))
  .addOption(
    createOption("-I, --skip-installs", "Do NOT populate dependencies after provisioning package.json").default(false)
  )
  .addOption(
    createOption("-X, --skip-extras", "Do NOT write any example classes.").default(
      Boolean(getConfig()),
      "true if project exists, false otherwise [currently " + Boolean(getConfig()) + "]"
    )
  )
  .addOption(optForce)

  .action(actionBzInit)

  .addCommand(bzInitInstall)
  .addCommand(bzInitFiles);
