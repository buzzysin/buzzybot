import { Middleware, middleware } from "@buzzybot/injex-discord-plugin"
import { ClientEvents } from "discord.js"
export type AdminMiddlewareEvents = "interactionCreate"

// ts class
@middleware()
export class AdminMiddleware extends Middleware<AdminMiddlewareEvents> {
async handle(...args: ClientEvents["interactionCreate"]) {
const [interaction] = args;

/* Implement this method */

return true;
}
}