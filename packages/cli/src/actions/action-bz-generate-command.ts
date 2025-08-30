import logger from "@buzzybot/cli/logger";
import { Command } from "commander";
import { existsSync } from "fs-extra";
import { resolve } from "path";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import getConfig, {
  bzProjectConfigDefault,
} from "@buzzybot/cli/other/get-config";
import { TemplateTree } from "@buzzybot/cli/other/template-tree";
import commandClassTemplate from "@buzzybot/cli/templates/framework/command.class.template";
import { forceWarning } from "@buzzybot/cli/inquiry/warning";

export type BzGenerateCommandOpts = { force?: boolean };

function pascalCase(s: string) {
  return s
    .replace(/[-_\s]+(.)?/g, (_m, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (s) => s.toUpperCase());
}

export const actionBzGenerateCommand = async (
  name: string,
  opts: BzGenerateCommandOpts,
  command: Command
) => {
  const log = logger(command);
  const { force = false } = opts || {};

  // Determine project configuration (commands folder)
  const config = getConfig() || bzProjectConfigDefault();
  const commandsFolder = config.commands || "commands";

  // Detect ext: prefer TS if tsconfig.json exists in cwd
  const cwd = process.cwd();
  const ext = existsSync(resolve(cwd, "tsconfig.json")) ? "ts" : "js";

  const dirPath = fsPathFrom(cwd);

  const fileName = `${name}.cmd.${ext}`;
  const className = `${pascalCase(name)}Command`;

  const targetPath = resolve(cwd, "src", commandsFolder, fileName);

  const check = await forceWarning(
    log,
    force,
    existsSync(targetPath),
    `A file already exists at ${targetPath}. Overwrite?`,
    `Overwriting ${targetPath}`,
    "Aborting operation."
  );

  if (!check) return;

  // Build template tree and write file
  const T = TemplateTree;

  const filesystem = new T({ name: dirPath() }, [
    new T({ name: "src" }, [
      new T({ name: commandsFolder }, [
        new T({
          name: fileName,
          template: commandClassTemplate,
          args: { ext, name: className, command: { name } },
        }),
      ]),
    ]),
  ]);

  await filesystem.build();

  log.success(`Wrote ${targetPath}`);
};
