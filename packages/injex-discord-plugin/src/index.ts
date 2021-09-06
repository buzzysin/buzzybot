import { DiscordCommand, DiscordSlashCommand } from "./classes/command";
import { Middleware } from "./classes/middleware";
import { middleware } from "./decorators/middleware";
import { slash } from "./decorators/slash";
import { DiscordInjexPlugin } from "./plugin";

export { DiscordInjexPlugin, slash, middleware, DiscordCommand, DiscordSlashCommand, Middleware };
