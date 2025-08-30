import classTemplate, { ClassTemplateOpts } from "@buzzybot/cli/templates/meta/class.template";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type CommandClassTemplateOpts = ClassTemplateOpts & {
  command: { name: string; description?: string };
};

export default function commandClassTemplate({ command, ...opts }: CommandClassTemplateOpts) {
  const { name, decorated = "", body = "", extending = "" } = opts;
  return dedent`
  ${importTemplate({ ext: opts.ext, value: "{ DiscordCommand, slash }", module: "@buzzybot/injex-discord-plugin" })}
  ${opts.ext === "ts" ? importTemplate({ ext: opts.ext, value: "{ ClientEvents }", module: "discord.js" }) : ""}

  ${classTemplate({
    ...opts,
    decorated: dedent`
    ${decorated}
    @slash({ name: "${command.name}", description: "${
      command.description ? command.description : "Let your server members know what I'm for"
    }" })`.trimStart(),
    extending: "DiscordCommand",
    body:
      opts.ext === "ts"
        ? dedent`
      async run(...args: ClientEvents["interactionCreate"]) {
        const [interaction] = args;
        
        /* Implement this method */
      }

    ${body}`
        : dedent`
      async run(...args) {
        const [interaction] = args;
        
        /* Implement this method */
      }

    ${body}`,
  })}`;
}
