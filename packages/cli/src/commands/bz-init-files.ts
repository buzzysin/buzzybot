import { actionBzInitFiles } from "@buzzybot/cli/actions/action-bz-init-files";
import getConfig from "@buzzybot/cli/other/get-config";
import { argDir } from "@buzzybot/cli/user-input/arg-dir";
import { optForce } from "@buzzybot/cli/user-input/opt-force";
import { createCommand, createOption } from "commander";

export const bzInitFiles = createCommand("files")
  .description("Write templated files into the project.")

  .addArgument(argDir)

  .addOption(
    createOption("-X, --skip-extras", "Do NOT write any example classes.").default(
      Boolean(!getConfig()),
      "true if project exists, false otherwise [currently " + Boolean(!getConfig()) + "]"
    )
  )
  .addOption(optForce)

  .action(actionBzInitFiles);
