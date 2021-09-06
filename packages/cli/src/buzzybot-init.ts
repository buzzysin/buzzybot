import { red } from "chalk";
import { Argument, Command, Option } from "commander";
import { resolve } from "path";

const program = new Command("init");

program
  .description(`Create a new @buzzybot project`)
  // .addArgument(new Argument(`<name>`, `the ${red("name")} of your bot`).)
  .addArgument(new Argument(`[dir]`, `the directory to ${red("create the project")} in`).default(process.cwd()))
  .addOption(
    new Option(
      `-e, --ext`,
      `the extension with which to ${red(
        "generate the files"
      )} with. A \`tsconfig.json\` will be generated if necessary.`
    )
      .default("ts")
      .choices(["ts", "js"])
  )
  .action((dir, thisthing, otherthing) => {
    const resolvedDir = resolve(process.cwd(), dir);
    console.log(`Generating a bot in ${resolvedDir}`);
  });

export const buzzybotInit = program;
