import dedent from "dedent";
import importTemplate from "./meta/import.template";
import { BzInitOpts } from "../actions/action-bz-init";

export type TsupConfigGeneratorOptions = Pick<BzInitOpts, "ext"> & {};

export default function tsupConfigGenerator({
  ext,
}: TsupConfigGeneratorOptions) {
  return dedent`
  ${importTemplate({
    ext,
    value: "{ defineConfig }",
    module: "tsup",
  })};
  
  export default defineConfig({
    entry: ["src/**/*.ts"],
    outDir: "dist",
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    clean: true,
    splitting: false,
    minify: false,
    legacyOutput: true,
    external: ["discord.js", "@injex/stdlib", "@injex/core"],
  });
  `;
}
