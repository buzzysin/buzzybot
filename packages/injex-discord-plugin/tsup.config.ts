import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: false, // generate declarations with tsc separately
  sourcemap: true,
  clean: true,
  external: ["discord.js"],
});
