import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import { forceWarning } from "@buzzybot/cli/inquiry/warning";
import logger from "@buzzybot/cli/logger";
import { fsPathFrom } from "@buzzybot/cli/other/fs-path-from";
import getConfig from "@buzzybot/cli/other/get-config";
import { TemplateTree } from "@buzzybot/cli/other/template-tree";
import babelConfigJsTemplate from "@buzzybot/cli/templates/babel.config.js.template";
import dotenvTemplate from "@buzzybot/cli/templates/dotenv.template";
import indexTemplate from "@buzzybot/cli/templates/index.template";
import commandClassTemplate from "@buzzybot/cli/templates/meta/command.class.template";
import middlewareClassTemplate from "@buzzybot/cli/templates/meta/middleware.class.template";
import setupBootstrapInjexTemplate from "@buzzybot/cli/templates/setup-bootstrap-injex.template";
import setupDotenvTemplate from "@buzzybot/cli/templates/setup-dotenv.template";
import setupTemplate from "@buzzybot/cli/templates/setup.template";
import tsConfigJsonTemplate from "@buzzybot/cli/templates/tsconfig.json.template";
import { Command } from "commander";

export type BzInitFilesOpts = Pick<BzInitOpts, "ext" | "commands" | "middleware" | "skipExtras" | "force"> & {};

const T = TemplateTree;

export const actionBzInitFiles = async (dir: string, opts: BzInitFilesOpts, command: Command) => {
  const log = logger(command);
  const { ext, skipExtras, commands, middleware } = opts;
  const dirPath = fsPathFrom(dir);

  log.info("Writing project folders...");

  if (skipExtras != Boolean(getConfig()))
    if (skipExtras) log.warn("Using `--skip-extras` other than default will not generate template files.");
    else {
      const sanityCheck = await forceWarning(
        log,
        false,
        true,
        "Using custom `--skip-extras` - ignore overwrites?",
        "Okay, I trust you.",
        "Aborting operation."
      );
    }

  const file = (file: string) => `${file}.${ext}`;

  const filesystem = new T(
    { name: dirPath() },
    [
      new T({ name: "src" }, [
        new T(
          { name: commands },
          skipExtras
            ? []
            : [
                new T({
                  name: file("ping.cmd"),
                  template: commandClassTemplate,
                  args: {
                    ext,
                    name: "PingCommand",
                    command: { name: "ping", description: "It pings!" },
                  },
                }),
              ]
        ),
        new T(
          { name: middleware },
          skipExtras
            ? []
            : [
                new T({
                  name: file("admin.mdw"),
                  template: middlewareClassTemplate,
                  args: {
                    ext,
                    name: "AdminMiddleware",
                  },
                }),
              ]
        ),
        new T({ name: "setup" }, [
          new T({ name: file("index"), template: setupTemplate, args: { ext } }),
          new T({ name: file("setup-env"), template: setupDotenvTemplate, args: { ext } }),
          new T({ name: file("setup-bootstrap-injex"), template: setupBootstrapInjexTemplate, args: { ext } }),
        ]),
        new T({ name: file("index"), template: indexTemplate, args: { ext } }),
      ]),
      new T({ name: ".env", template: dotenvTemplate }),
      new T({ name: "babel.config.js", template: babelConfigJsTemplate, args: { cwd: dirPath(), ext } }),
      new T({ name: `${ext}config.json`, template: tsConfigJsonTemplate, args: { cwd: dirPath() } }),
    ].concat(
      ext === "ts"
        ? [
            /* ts only files */
          ]
        : [
            /* js only files */
          ]
    )
  );

  log.info("Writing project files...");

  await filesystem.build();
};
