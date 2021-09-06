import { DiscordCommand, slash } from "@buzzybot/injex-discord-plugin";
import { ClientEvents } from "discord.js";

@slash({
  name: "ping",
  description: "It pings!",
  options: options =>
    options.addIntegerOption(times =>
      times.setName("times").setDescription("how many times to ping the user").setRequired(false)
    ),
})
export class PingCommand extends DiscordCommand {
  async run(...args: ClientEvents["interactionCreate"]) {
    const [interaction] = args;

    if (!interaction.isCommand()) return;

    const times = interaction.options.getInteger("times");

    if (times !== null && times >= 1) {
      const fixedTimes = times > 100 ? 1 : times;
      const descTimes = times > 100 ? "Too many" : times.toString();

      return await interaction.reply(`${"Pong! ".repeat(fixedTimes).trim()} ${descTimes} times!`);
    }

    await interaction.reply("Pong!");
  }
}
