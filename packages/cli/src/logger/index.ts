import { bold, green, red, white, yellow } from "chalk";
import { Command } from "commander";

const success =
  (command: Command) =>
  (...args: any[]) =>
    console.log(green`✔️  bz ${command.name()}`, ...args);
const info =
  (command: Command) =>
  (...args: any[]) =>
    console.log(yellow`💡 bz ${command.name()}`, ...args);
const warn =
  (command: Command) =>
  (...args: any[]) =>
    console.log(bold`${white`⚠️  bz ${command.name()}`}`, ...args);
const error =
  (command: Command) =>
  (...args: any[]) =>
    console.log(red`⛔ bz ${command.name()}`, ...args);

const logger = (command: Command) => ({
  success: success(command),
  info: info(command),
  warn: warn(command),
  error: error(command),
});

export default logger;
