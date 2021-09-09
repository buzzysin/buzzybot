/** @type {import("@babel/core").TransformOptions} */
module.exports = {
  extends: "../../babel.config.js",
  overrides: [
    {
      plugins: [
        [
          "babel-plugin-module-resolver",
          {
            alias: {
              "^@buzzybot/(\\w+)$": "../../packages/\\1/bin",
              "^@buzzybot/(\\w+)/(.+)$": "../../packages/\\1/bin/\\2",
            },
          },
        ],
      ],
    },
  ],
};
