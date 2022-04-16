import dedent from "dedent";

type TsClassTemplateOpts = {
  ext: "ts";
  name: string;
  body?: string;
  decorated?: string;
  extending?: string;
  implementing?: string[];
};

type JsClassTemplateOpts = {
  ext: "js";
  name: string;
  body?: string;
  decorated?: string;
  extending?: string;
};

export type ClassTemplateOpts = JsClassTemplateOpts | TsClassTemplateOpts;

export default function classTemplate(opts: ClassTemplateOpts) {
  return opts.ext === "ts" ? tsClassTemplate(opts) : jsClassTemplate(opts);
}

export function tsClassTemplate(opts: TsClassTemplateOpts) {
  const { name, decorated = "", body = "", extending = "", implementing = [] } = opts;
  return dedent`
  // ts class
  ${decorated ? decorated : ""}
  export class ${name}${extending ? ` extends ${extending}` : ""}${
    implementing && implementing.length ? ` implements ${implementing.join(", ")}` : ""
  } {
    ${body ? body : ""}
  }
  `.trimStart();
}
export function jsClassTemplate({ name, decorated, body, extending }: JsClassTemplateOpts) {
  return dedent`
  // js class
  ${decorated}
  export class ${name}${extending ? ` extends ${extending}` : ""} {
    ${body ? body : ""}
  }
  `.trimStart();
}
