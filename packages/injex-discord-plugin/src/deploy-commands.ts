import { SlashCommandBuilder, ToAPIApplicationCommandOptions } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const commandsDeployed = { hasBeenRun: false };

export type DeployCommandConfig = {
  commands: SlashCommandBuilder[];
  token: string;
  clientId: string;
} & (
  | {
      mode: "development" | "test" |  "production" | "staging";
      guildId?: string;
    }
);

export default async function deployCommands({ commands, token, clientId, ...opts }: DeployCommandConfig) {
  if (commandsDeployed.hasBeenRun) return;

  const jsonCommands = commands.map(cmd => cmd.toJSON());

  const api = new REST({ version: "9" }).setToken(token);

  if (opts.mode === "development" && opts.guildId) {
    const guildId = opts.guildId;
    try {
      const result = await api.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: jsonCommands,
      });
      commandsDeployed.hasBeenRun = true;
      return result;
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      const result = await api.put(Routes.applicationCommands(clientId), {
        body: jsonCommands,
      });
      commandsDeployed.hasBeenRun = true;
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
