import { bold, green, red, white, yellow } from "chalk";
import { Command } from "commander";
import { inspect } from "util";

const processArgs = (...args: any[]) => {
  return args
    .map(arg =>
      inspect(arg)
        .split("\n")
        .map(s => s.replace(/^['"](.*)['"]/m, "$1"))
    )
    .reduce((acc, strings) => acc.concat(...strings), []);
};

export const successString = (command: Command) => green`✔️  bz ${command.name()}`;
export const infoString = (command: Command) => yellow`💡 bz ${command.name()}`;
export const warningString = (command: Command) => bold`${white`⚠️  bz ${command.name()}`}`;
export const errorString = (command: Command) => red`⛔ bz ${command.name()}`;

const success =
  (command: Command) =>
  (...args: any[]) =>
    console.log(successString(command), ...args);
const info =
  (command: Command) =>
  (...args: any[]) =>
    console.info(infoString(command), ...args);
const warn =
  (command: Command) =>
  (...args: any[]) =>
    console.warn(warningString(command), ...args);
const error =
  (command: Command) =>
  (...args: any[]) =>
    console.error(errorString(command), ...args);

const logger = (command: Command) => ({
  success: success(command),
  info: info(command),
  warn: warn(command),
  error: error(command),
});

export type Logger = ReturnType<typeof logger>;

export default logger;
