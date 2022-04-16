import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type IndexTemplateOpts = {
  ext: BzInitOpts["ext"];
};

const indexTemplate = (opts: IndexTemplateOpts) => {
  const { ext } = opts;
  return dedent`${importTemplate({ ext, module: "./setup" })}`.trimStart();
};

export default indexTemplate;
