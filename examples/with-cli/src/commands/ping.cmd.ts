import { DiscordCommand, slash } from "@buzzybot/injex-discord-plugin";
import { ChatInputCommandInteraction } from "discord.js";

// ts class
@slash({ name: "ping", description: "It pings!" })
export class PingCommand extends DiscordCommand {
  async run(...args: [ChatInputCommandInteraction]) {
    const [interaction] = args;
    /* Implement this method */
    
    /* Captures when the interaction started and the current time, returning a message that has the difference in ms. */
    const end = Date.now();
    const start = interaction.createdAt.getTime();
    const duration = end - start;

    await interaction.reply(`Pong! Response time: ${duration}ms`);
  }
}
