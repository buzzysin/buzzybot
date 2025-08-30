import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { inspect } from "util";
import { Hidden } from "./hidden";

declare global {
  var appCommandsDeployed: boolean;
  var guildCommandsDeployed: boolean;
}
globalThis.appCommandsDeployed = false;
globalThis.guildCommandsDeployed = false;

export type DeployCommandConfig = {
  commands: SlashCommandBuilder[];
  /* Hidden to prevent accidental credential leakage */
  token: Hidden<string>;
  clientId: string;
} & {
  mode: "development" | "test" | "production" | "staging";
  guildId?: string;
};
const consoleTap = <T>(arg: T) => (inspect(arg, { depth: null }), arg);

export default async function deployCommands({
  commands,
  token,
  clientId,
  guildId,
  ...opts
}: DeployCommandConfig) {
  if (globalThis.appCommandsDeployed) {
    console.log("Commands already deployed.");
    return;
  }

  const api = new REST().setToken(token.get());

  const secret = (str: string) =>
    Array.from({ length: str.length }, () => "*").join("");

  console.debug(
    `Deploying commands with clientId: ${secret(
      clientId
    )} and guildId: ${secret(guildId || "")}`
  );

  // Reset all commands
  // for guild-based commands
  if (guildId) {
    try {
      await api.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: [],
      });

      console.log("Successfully deleted all guild commands.");
    } catch (e) {
      console.error(
        "<GUILD_COMMANDS_ERROR> There was a problem deleting guild commands."
      );
      // console.error(e);
    }
  }

  // for global commands
  try {
    await api.put(Routes.applicationCommands(clientId), { body: [] });

    console.log("Successfully deleted all application commands.");
  } catch (e) {
    console.error(
      "<APPLICATION_COMMANDS_ERROR> There was a problem deleting global commands."
    );
    // console.error(e);
  }

  const jsonCommands = commands.map(consoleTap).map((cmd) => cmd.toJSON());
  if (guildId && !globalThis.guildCommandsDeployed) {
    console.debug("Deploying commands to guild:", guildId);

    try {
      const result = await api.put(
        Routes.applicationGuildCommands(clientId, guildId),
        {
          body: jsonCommands,
        }
      );

      globalThis.guildCommandsDeployed = true;

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  if (!globalThis.appCommandsDeployed) {
    console.debug("Deploying commands to global...");

    try {
      const result = await api.put(Routes.applicationCommands(clientId), {
        body: jsonCommands,
      });

      globalThis.appCommandsDeployed = true;

      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
