import { defineConfig } from "tsup";

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
