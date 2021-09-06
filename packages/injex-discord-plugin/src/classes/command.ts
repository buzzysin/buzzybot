import { ClientEvents } from "discord.js";

export abstract class DiscordCommand {
  /**
   * Implement this method if you want
   */
  run?(...args: any[]): void | Promise<void> {}
}

export abstract class DiscordSlashCommand extends DiscordCommand {
  
}