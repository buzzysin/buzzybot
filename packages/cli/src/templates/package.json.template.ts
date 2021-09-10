import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import merge from "@buzzybot/cli/other/merge";
import { resolve } from "path";

export type PackageJsonTemplateOpts = {
  ext: BzInitOpts["ext"];
  cwd: string;
};

export default function packageJsonTemplate({ ext, cwd }: PackageJsonTemplateOpts = { ext: "ts", cwd: process.cwd() }) {
  const packageJson = {};
  const name = cwd.split("/").reverse()[0];

  try {
    const actualJson = require(resolve(cwd, "package.json"));
    Object.assign(packageJson, actualJson);
  } catch {}

  return merge(
    {
      name,
      author: "[GITHUB_USERNAME] <[GITHUB_USERNAME]@users.noreply.github.com>",
      license: "ISC",
      version: "0.0.0",
      scripts: {
        test: "echo 'No test suite configured.' && exit 1",
      },
    },
    packageJson,
    "CONCAT"
  );
}
