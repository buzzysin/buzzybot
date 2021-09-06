import { Command } from "commander";
import { version } from "../package.json";
import { buzzybotInit } from "./buzzybot-init";

const program = new Command("buzzybot");

program.version(version).addCommand(buzzybotInit, { isDefault: true });

program.parse();
