import merge from "@buzzybot/cli/other/merge";
import { resolve } from "path";

export type TsConfigJsonTemplateOpts = {
  cwd: string;
};

export default function tsConfigJsonTemplate(opts: TsConfigJsonTemplateOpts) {
  return JSON.stringify(tsConfigJsonGenerator(opts), null, 2);
}

export function tsConfigJsonGenerator({ cwd }: TsConfigJsonTemplateOpts = { cwd: process.cwd() }) {
  const tsConfigJson = {};
  const name = cwd.split("/").reverse()[0];

  try {
    const actualJson = require(resolve(cwd, "tsconfig.json"));
    Object.assign(tsConfigJson, actualJson);
  } catch {}

  return merge(
    {
      compilerOptions: {
        baseUrl: ".",
        module: "commonjs",
        moduleResolution: "node",
        target: "ES6",
        paths: {
          [`@src`]: ["./src"],
          [`@src/*`]: ["./src/*"],
        },
        esModuleInterop: true,
        downlevelIteration: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        importHelpers: true,
        inlineSourceMap: true,
        resolveJsonModule: true,
        skipLibCheck: true,
        strict: true,
      },
      compileOnSave: true,
    },
    tsConfigJson,
    "CONCAT_UNIQUE"
  );
}
