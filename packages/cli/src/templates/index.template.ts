import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/import.template";
import dedent from "dedent";

export type IndexTemplateOpts = {
  ext: BzInitOpts["ext"];
};

const indexTemplate = (opts: IndexTemplateOpts) => {
  const { ext } = opts;
  let template = ``;
  template += `${importTemplate({ ext, value: `setupInjex`, module: "./setup/injex" })}`;
  template += `${importTemplate({
    ext,
    value: "{ apiToken, clientId, guildId }",
    module: "./util/environment/variables",
  })}`;
  template += "\n";
  template += dedent`setupInjex({ token: apiToken, clientId, guildId })`;
  return template;
};

export default indexTemplate;
