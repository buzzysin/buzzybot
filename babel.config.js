/** @type {import("@babel/core").TransformOptions} */
module.exports = {
  assumptions: {
    setPublicClassFields: true,
    privateFieldsAsProperties: true
  },
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    // ["babel-plugin-transform-typescript-metadata"],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties"],
    ["@babel/plugin-proposal-private-property-in-object"],
    ["@babel/plugin-proposal-private-methods"],
    ["@babel/plugin-transform-runtime", { regenerator: true }],
  ],
};
