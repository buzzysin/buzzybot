import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import merge from "@buzzybot/cli/other/merge";
import { resolve } from "path";

export type PackageJsonTemplateOpts = {
  ext: BzInitOpts["ext"];
  cwd: string;
};

export default function packageJsonTemplate({
  ext,
  cwd,
}: PackageJsonTemplateOpts) {
  return JSON.stringify(packageJsonGenerator({ ext, cwd }), null, 2);
}

export function packageJsonGenerator(
  { ext, cwd }: PackageJsonTemplateOpts = { ext: "ts", cwd: process.cwd() }
) {
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
      private: true,
      files: ["dist", "buzzybot.json"],
      scripts: Object.assign(
        {
          build: "tsup",
          "build:watch": "tsup --watch",
          clean: "rimraf dist *.tsbuildinfo",
          dev: "nodemon dist",
          start: "node dist/index.js",
          test: 'echo "Error: no test specified" && exit 1',
        },
        ext === "ts"
          ? {
              "build:types": "tsc -b",
              typecheck: "tsc --noEmit",
            }
          : {}
      ),
    },
    packageJson,
    "CONCAT_UNIQUE"
  );
}
