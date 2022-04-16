import { DiscordCommand, slash } from "@buzzybot/injex-discord-plugin"
import { ClientEvents } from "discord.js"

// ts class
@slash({ name: "ping", description: "It pings!" })
export class PingCommand extends DiscordCommand {
async run(...args: ClientEvents["interactionCreate"]) {
const [interaction] = args;

/* Implement this method */
}
}