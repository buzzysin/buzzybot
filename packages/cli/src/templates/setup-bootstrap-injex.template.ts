import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type SetupBootstrapInjexTemplate = Pick<BzInitOpts, "ext">;

export default function setupBootstrapInjexTemplate(opts: SetupBootstrapInjexTemplate) {
  const { ext } = opts;
  return dedent`
  ${
    ext == "ts"
      ? importTemplate({ ext, value: "{ bootstrap, IBootstrap }", module: "@injex/core" })
      : importTemplate({ ext, value: "{ bootstrap }", module: "@injex/core" })
  };
  
  @bootstrap()
  export class BootstrapInjex ${ext == "ts" ? "implements IBootstrap " : " "}{
    /** 
     * you can ${ext === "ts" ? "import" : "require"} your other app entry points inside 
     * this \`run()\` function. You can go one step further and integrate your app with 
     * Injex, but reading their documentation first is strongly recommended. 
     */
    async run() {}
  }
  `.trimStart();
}
