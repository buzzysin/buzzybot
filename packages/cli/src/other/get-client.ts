import { existsSync } from "fs";
import { resolve } from "path";

export type GetClientOpts = {
  cwd?: string;
};
export default function getClient(
  { cwd }: { cwd: string } = { cwd: process.cwd() }
): "yarn" | "npm" | "pnpm" {
  const packageLock = existsSync(resolve(cwd, "package-lock.json"));
  const yarnLock = existsSync(resolve(cwd, "yarn.lock"));
  const pnpmLock = existsSync(resolve(cwd, "pnpm-lock.yaml"));

  if (packageLock) return "npm";
  if (yarnLock) return "yarn";
  if (pnpmLock) return "pnpm";

  const test = /(npm|yarn|pnpm)\/v?\d+\.\d+\.\d+/;

  const match = (process.env.npm_config_user_agent || "").match(test);

  if (!match) return "npm";

  if (match[1] === "npm") return "npm";
  if (match[1] === "yarn") return "yarn";
  if (match[1] === "pnpm") return "pnpm";

  return "npm";
}
