import { existsSync } from "fs";
import { resolve } from "path";

export type GetClientOpts = {
  cwd?: string;
};
export default function getClient({ cwd }: { cwd: string } = { cwd: process.cwd() }): "yarn" | "npm" {
  const packageLock = existsSync(resolve(cwd, "package-lock.json"));
  const yarnLock = existsSync(resolve(cwd, "yarn.lock"));

  if (packageLock) return "npm";
  if (yarnLock) return "yarn";

  const test = /(npm|yarn)\/v?\d+\.\d+\.\d+/;

  const match = (process.env.npm_config_user_agent || "").match(test);

  if (!match) return "npm";

  if (match[1] === "npm") return "npm";
  if (match[1] === "yarn") return "yarn";

  return "npm";
}
