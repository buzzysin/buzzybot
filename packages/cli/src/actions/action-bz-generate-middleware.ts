import logger from "@buzzybot/cli/logger";
import { Command } from "commander";
import { existsSync } from "fs-extra";
import { resolve } from "path";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import getConfig, {
  bzProjectConfigDefault,
} from "@buzzybot/cli/other/get-config";
import { TemplateTree } from "@buzzybot/cli/other/template-tree";
import middlewareClassTemplate from "@buzzybot/cli/templates/framework/middleware.class.template";
import { forceWarning } from "@buzzybot/cli/inquiry/warning";

export type BzGenerateMiddlewareOpts = { force?: boolean };

function pascalCase(s: string) {
  return s
    .replace(/[-_\s]+(.)?/g, (_m, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (s) => s.toUpperCase());
}

export const actionBzGenerateMiddleware = async (
  name: string,
  opts: BzGenerateMiddlewareOpts,
  command: Command
) => {
  const log = logger(command);
  const { force = false } = opts || {};

  const config = getConfig() || bzProjectConfigDefault();
  const middlewareFolder = config.middleware || "middleware";

  const cwd = process.cwd();
  const ext = existsSync(resolve(cwd, "tsconfig.json")) ? "ts" : "js";

  const dirPath = fsPathFrom(cwd);

  const fileName = `${name}.mdw.${ext}`;
  const className = `${pascalCase(name)}Middleware`;

  const targetPath = resolve(cwd, "src", middlewareFolder, fileName);

  const check = await forceWarning(
    log,
    force,
    existsSync(targetPath),
    `A file already exists at ${targetPath}. Overwrite?`,
    `Overwriting ${targetPath}`,
    "Aborting operation."
  );

  if (!check) return;

  const T = TemplateTree;

  const filesystem = new T({ name: dirPath() }, [
    new T({ name: "src" }, [
      new T({ name: middlewareFolder }, [
        new T({
          name: fileName,
          template: middlewareClassTemplate,
          args: { ext, name: className },
        }),
      ]),
    ]),
  ]);

  await filesystem.build();

  log.success(`Wrote ${targetPath}`);
};
