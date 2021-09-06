import { ClientEvents } from "discord.js";

export type HandleResult = {} | { error: Error; reason?: string };
export abstract class Middleware<T extends keyof ClientEvents = "interactionCreate"> {
  abstract handle(...args: ClientEvents[T]): HandleResult | Promise<HandleResult>;
}
