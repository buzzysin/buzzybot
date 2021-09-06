import { DiscordCommand, slash } from "@buzzybot/injex-discord-plugin";
import { CommandInteraction } from "discord.js";
import { AdminInteractionMiddleware } from "../middleware/admin.mdw";
import { NothingMiddleware } from "../middleware/nothing.mdw";

@slash({
  name: "test",
  description: "test description",
  groups: [{ name: "ambiguous", description: "ambiguous test group" }],
})
@slash.group({ name: "private", description: "private test group", protect: [AdminInteractionMiddleware] })
@slash.group({ name: "public", description: "public test group" })
@slash.protect.all(NothingMiddleware)
export class TestCommand extends DiscordCommand {
  @slash.protect(AdminInteractionMiddleware)
  async run() {
    // This will not run (because of group/sub commands), it is just a test
  }

  @slash.group.command({
    group: "public",
    name: "sayhi",
    description: "say hi to someone",
    options: options =>
      options.addUserOption(user => user.setName("user").setDescription("User to say hi to").setRequired(false)),
  })
  async testPublicCommand(command: CommandInteraction) {
    const user = command.options.getUser("user");
    if (user) {
      await command.reply(`Hey ${user}, ${command.user} says hi.`);
    }

    await command.reply(`Hey, ${command.user}!`);
  }

  @slash.group.command({
    group: "private",
    name: "pinghi",
    description: "pings someone",
    options: options =>
      options.addUserOption(user => user.setName("user").setDescription("User to ping").setRequired(true)),
  })
  // Unnecessary
  @slash.protect(NothingMiddleware)
  async testPrivateCommand(command: CommandInteraction) {
    await command.deferReply();

    const user = command.options.getUser("user");

    setTimeout(async () => {
      if (user) {
        await command.editReply(`${user}! ||Pinged by ${command.user.username}||`);
      }
    }, 10000);
  }

  @slash.group.command({
    group: "ambiguous",
    name: "uhwhat",
    description: "should you be allowed to do this?",
    protect: [AdminInteractionMiddleware /* No, you shouldn't */],
  })
  testAmbiguousCommand(command: CommandInteraction) {}

  @slash.sub({
    name: "ungrouped",
    description: "I'm a free bench, baby!",
    protect: [NothingMiddleware],
  })
  testUngroupedCommand(command: CommandInteraction) {}
}
