import { actionBzInitInstall } from "@buzzybot/cli/actions/action-bz-init-install";
import { argDir } from "@buzzybot/cli/user-input/arg-dir";
import { optForce } from "@buzzybot/cli/user-input/opt-force";
import { createCommand, createOption } from "commander";

export const bzInitInstall = createCommand("install")
  .description("Load the required dependencies for the project.")

  .addArgument(argDir)
  
  .addOption(
    createOption("-I, --skip-installs", "Do NOT populate dependencies after provisioning package.json").default(false)
  )
  .addOption(optForce)

  .action(actionBzInitInstall);
