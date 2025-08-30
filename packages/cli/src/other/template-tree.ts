import { Tree } from "@buzzybot/cli/other/tree";
import { exists, mkdirp, writeFile } from "fs-extra";
import logger from "../logger";

export type Dict = Record<string, unknown>;
export type TemplateFn<A extends Dict = Dict> = (opts: A) => string;
export type Template<A extends Dict = Dict> = TemplateFn<A> | string;

export type FsTemplateString = {
  name: string;
  template: string;
  args: never;
};
export type FsTemplateFn<T extends TemplateFn = TemplateFn> = {
  name: string;
  template: T;
  args: T extends TemplateFn<infer A> ? A : never;
};

export type FsFile<A extends Dict = Dict> =
  | FsTemplateString
  // @ts-ignore
  | FsTemplateFn<TemplateFn<A>>;

export type FsDir = {
  name: string;
};

export class TemplateTree<A extends Dict = Dict> extends Tree<
  FsFile<A> | FsDir
> {
  async build(
    { force, log }: { force: boolean; log?: ReturnType<typeof logger> } = {
      force: false,
    }
  ) {
    return this.execAsyncBfs(async (node) => {
      const segments: string[] = [];

      let current: Tree<FsFile | FsDir> | null = node;

      while (current) {
        segments.unshift(current.value.name);
        current = current.parent;
      }

      const name = segments.join("/");

      if ("template" in node.value) {
        const fileExists = await exists(name);

        if (fileExists && !force) {
          log?.warn(`File ${name} already exists. Skipping...`);
          return;
        } else if (fileExists && force) {
          log?.info(`Overwriting existing file ${name}...`);
        }

        await writeFile(
          name,
          typeof node.value.template === "string" /*  */
            ? node.value.template /*  */
            : node.value.template(node.value.args),
          { flag: "w" }
        );
      } else {
        await mkdirp(name);
      }
    });
  }
}
