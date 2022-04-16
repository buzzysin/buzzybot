import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import dedent from "dedent";

export type ImportTemplate = {
  ext: BzInitOpts["ext"];
  value?: string;
  module: string;
};

export default function importTemplate(opts: ImportTemplate) {
  const { ext = "ts", value, module } = opts;
  return (
    ext == "ts"
      ? value
        ? dedent`import ${value} from "${module}"`
        : dedent`import "${module}"`
      : ext == "js"
      ? value
        ? dedent`const ${value} = require("${module}")`
        : dedent`require("${module}")`
      : ""
  ).trimStart();
}
