/** @type {import("@babel/core").TransformOptions} */
module.exports = {
"presets": [
  "@babel/preset-env"
],
"plugins": [
  [
    "@babel/plugin-proposal-decorators",
    {
      "legacy": true
    }
  ],
  [
    "@babel/plugin-proposal-class-properties"
  ],
  [
    "@babel/plugin-proposal-private-property-in-object"
  ],
  [
    "@babel/plugin-proposal-private-methods"
  ],
  [
    "@babel/plugin-transform-runtime",
    {
      "regenerator": true
    }
  ],
  [
    "babel-plugin-module-resolver",
    {
      "alias": {
        "^@src/(\\w+)$": "./src/\\1"
      }
    }
  ]
]
};