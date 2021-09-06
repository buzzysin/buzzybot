import { middleware, Middleware } from "@buzzybot/injex-discord-plugin";
import { ClientEvents } from "discord.js";

type accepted = "interactionCreate";

@middleware()
export class AdminInteractionMiddleware extends Middleware<accepted> {
  async handle(...args: ClientEvents["interactionCreate"]) {
    const [interaction] = args;

    const member = await interaction.guild?.members.fetch(interaction.user);

    if (!member) return { error: new Error("Member not found") };

    if (member.permissions.has(["ADMINISTRATOR"])) return true;

    return { error: new Error(), reason: "Member is not an administrator" };
  }
}
