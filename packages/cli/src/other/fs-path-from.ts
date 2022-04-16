import { resolve } from "path";

export const fsPathFrom =
  (root: string) =>
  (...segments: string[]) =>
    resolve(root, ...segments);
