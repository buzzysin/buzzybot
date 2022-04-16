import { BzInitOpts } from "@buzzybot/cli/actions/action-bz-init";
import merge from "@buzzybot/cli/other/merge";
import dedent from "dedent";
import { readdirSync } from "fs";
import { resolve } from "path";

export type BabelConfigJsonTemplateOpts = Pick<BzInitOpts, "ext"> & {
  cwd: string;
};

const babelConfig = (ext: "js" | "ts") => ({
  presets: ["@babel/preset-env"].concat(ext === "ts" ? ["@babel/preset-typescript"] : []),
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-proposal-private-property-in-object"],
    ["@babel/plugin-proposal-private-methods"],
    ["@babel/plugin-transform-runtime", { regenerator: true }],
    [
      "babel-plugin-module-resolver",
      {
        alias: {
          "^@src/(\\w+)$": "./src/\\1",
        },
      },
    ],
  ],
});

export default function babelConfigJsTemplate({ cwd, ext }: BabelConfigJsonTemplateOpts) {
  const files = readdirSync(cwd);
  const babelCandidate = files.find(f => f.match(/\.?babel(rc|\.config)?(\.json)?/));

  const babelConfigJs = JSON.stringify(babelConfigJsGenerator({ cwd, ext }), null, 2);

  if (babelCandidate && babelCandidate.match(/\.json|rc$/)) {
    return babelConfigJs;
  }

  return dedent`
  /** @type {import("@babel/core").TransformOptions} */
  module.exports = ${babelConfigJs};
  `.trimStart();
}

export function babelConfigJsGenerator({ cwd, ext }: BabelConfigJsonTemplateOpts) {
  const files = readdirSync(cwd);

  const babelCandidate = files.find(f => f.match(/\.?babel(rc|\.config)?(\.json)?/));

  if (typeof babelCandidate !== "undefined") {
    if (babelCandidate.match(/\.json|rc$/)) {
      const babelConfigJson = require(resolve(cwd, babelCandidate));
      return merge(babelConfig(ext), babelConfigJson, "CONCAT_UNIQUE");
      //
    } else if (babelCandidate.match(/\.js$/)) {
      const babelConfigJs = require(resolve(cwd, babelCandidate));
      return merge(babelConfig(ext), babelConfigJs, "CONCAT_UNIQUE");
      //
    }
  }

  return babelConfig(ext);
}
