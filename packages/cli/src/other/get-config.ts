import { BzProjectConfig } from "@buzzybot/cli/other/types";
import { readFileSync } from "fs";
import { existsSync } from "fs-extra";
import { resolve } from "path";

export type GetConfigOpts = {
  cwd: string;
};

export function bzProjectConfigDefault(): BzProjectConfig {
  let version;
  const packageJsonExists = existsSync(resolve("../../", "package.json"));
  const packageJson = JSON.parse(readFileSync(resolve("../../", "package.json"), "utf8"));

  if (packageJsonExists) {
    version = packageJson["version"];
  } else {
    version = "unable to determine version";
  }

  return {
    commands: "commands",
    middleware: "middleware",
    version,
  };
}

export default function getConfig({ cwd }: GetConfigOpts = { cwd: process.cwd() }): BzProjectConfig {
  const confExists = existsSync(resolve(cwd, "buzzybot.json"));

  if (!confExists) return null as unknown as BzProjectConfig;

  const conf: BzProjectConfig = JSON.parse(readFileSync(resolve(cwd, "buzzybot.json"), "utf8"));

  return conf;
}
