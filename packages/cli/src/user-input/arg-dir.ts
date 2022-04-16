import { createArgument } from "commander";

export const argDir = createArgument("<dir>", "the destination directory (relative to current directory)");
