const { DiscordCommand, slash } = require("@buzzybot/injex-discord-plugin")


// js class
@slash({ name: "ping", description: "It pings!" })
export class PingCommand extends DiscordCommand {
async run(...args) {
const [interaction] = args;

/* Implement this method */
}
}