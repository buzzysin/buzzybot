import { spawn } from "child_process";

export type PackageMap = { [pkg: string]: string | undefined };
export type PackageList = string[];
export type Packages = PackageMap | PackageList;

export type StdioOption = "pipe" | "ignore" | "inherit";

export type InstallPnpmOptions = {
  cwd?: string;
  dev?: boolean;
  stdio?: StdioOption;
  /** prefer is accepted to mirror other helpers but not used by pnpm here */
  prefer?: string;
};

function normalizePackages(pkgs?: Packages): string[] {
  if (!pkgs) return [];
  if (Array.isArray(pkgs)) return pkgs.slice();
  return Object.keys(pkgs).map((name) => {
    const ver = (pkgs as PackageMap)[name];
    return ver ? `${name}@${ver}` : name;
  });
}

function mapStdio(s: StdioOption | undefined): "pipe" | "inherit" | "ignore" {
  return s || "pipe";
}

/**
 * Install packages using pnpm.
 * Works with either a map of package->version or a list of package specifiers.
 */
export async function installPnpm(
  packages: Packages,
  options: InstallPnpmOptions = {}
): Promise<void> {
  const pkgs = normalizePackages(packages);
  const args: string[] = [];

  if (pkgs.length === 0) {
    // no explicit packages -> run a regular install
    args.push("install");
  } else {
    args.push("add", ...pkgs);
    if (options.dev) args.push("-D");
  }

  const stdio = mapStdio(options.stdio);

  await new Promise<void>((resolve, reject) => {
    const child = spawn("pnpm", args, {
      cwd: options.cwd,
      stdio: ["inherit", stdio, "inherit"],
      env: process.env,
    });

    child.on("error", (err) => reject(err));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`pnpm exited with code ${code}`));
    });
  });
}

export default installPnpm;
