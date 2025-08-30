"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/setup/setup-env.ts
var setup_env_exports = {};
__export(setup_env_exports, {
  apiToken: () => apiToken,
  devId: () => devId,
  devServer: () => devServer
});
module.exports = __toCommonJS(setup_env_exports);
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var devId = process.env.DISCORD_DEV_ID;
var devServer = process.env.DISCORD_DEV_SERVER;
var apiToken = process.env.DISCORD_API_TOKEN;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  apiToken,
  devId,
  devServer
});
