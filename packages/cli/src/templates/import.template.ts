import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";

export type ImportTemplate = {
  ext: BzInitOpts["ext"];
  value: string;
  module: string;
};

const importTemplate = (opts: ImportTemplate) => {
  const { ext = "ts", value, module } = opts;
  return `${ext === "ts" ? "import" : "const"} ${value} ${ext === "ts" ? "from" : "="} ${
    ext === "ts" ? `"${module}"` : `require("${module}")`
  }\n`;
};

export default importTemplate;
