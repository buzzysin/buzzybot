import classTemplate, { ClassTemplateOpts } from "@buzzybot/cli/templates/meta/class.template";
import importTemplate from "@buzzybot/cli/templates/meta/import.template";
import dedent from "dedent";

export type MiddlewareClassTemplateOpts = ClassTemplateOpts;

export default function middlewareClassTemplate(opts: MiddlewareClassTemplateOpts) {
  const { ext, decorated = "", body = "" } = opts;
  return dedent`
  ${importTemplate({ ext, value: "{ Middleware, middleware }", module: "@buzzybot/injex-discord-plugin" })}
  ${opts.ext === "ts" ? importTemplate({ ext, value: "{ ClientEvents }", module: "discord.js" }) : ""}

  ${opts.ext === "ts" ? `export type ${opts.name}Events = "interactionCreate"` : ""}

  ${classTemplate({
    ...opts,
    decorated: dedent`
    ${decorated}
    @middleware()`.trimStart(),
    extending: ext === "ts" ? `Middleware<${opts.name}Events>` : "Middleware",
    body:
      opts.ext === "ts"
        ? dedent`
    async handle(...args: ClientEvents["interactionCreate"]) {
      const [interaction] = args;
      
      /* Implement this method */

      return true;
    }

    ${body}`
        : dedent`
    async handle(...args) {
      const [interaction] = args;
      
      /* Implement this method */

      return true;
    }

    ${body}`,
  })}`
    .trim()
    .replace(/\n{2,}/, "\n");
}
