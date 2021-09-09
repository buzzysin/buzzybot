#!/usr/bin/env node

import { Command } from "commander";
import { bzGenerate } from "./bz-generate";
import { bzInit } from "./bz-init";

const program = new Command();
const { version } = require("../../package.json");

program /*  */
  .version(version)
  .description("@buzzybot/cli - the CLI to create a new Discord.JS project using classes and decorators.")

  .addCommand(bzInit)
  .addCommand(bzGenerate);

if (typeof require !== "undefined" && require.main) {
  program.parse(process.argv);
}
